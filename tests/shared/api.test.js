import { describe, expect, it, vi } from "vitest";
import { ApiError, ClubhouseClient } from "@shared/api/client.js";
import { createApi } from "@shared/api/endpoints.js";

function fakeTransport(response = {}, { status = 200, ok = true } = {}) {
	return vi.fn().mockResolvedValue({
		ok,
		status,
		text: async () => JSON.stringify(response)
	});
}

function makeClient(transport, session = { deviceId: "D", userId: 1, authToken: "T" }) {
	return new ClubhouseClient({ getSession: () => session, transport });
}

describe("ClubhouseClient", () => {
	it("GETs when there is no body and POSTs when there is", async () => {
		const transport = fakeTransport({ success: true });
		const client = makeClient(transport);

		await client.request("/get_events", { query: { page: 1 } });
		expect(transport.mock.calls[0][1].method).toBe("GET");

		await client.request("/follow", { body: { user_id: 2 } });
		expect(transport.mock.calls[1][1].method).toBe("POST");
	});

	it("serialises the query string and skips null values", async () => {
		const transport = fakeTransport({});
		await makeClient(transport).request("/get_following", {
			query: { user_id: 5, page: 1, missing: null }
		});

		const url = transport.mock.calls[0][0];
		expect(url).toContain("user_id=5");
		expect(url).toContain("page=1");
		expect(url).not.toContain("missing");
	});

	it("attaches the auth token and identity headers", async () => {
		const transport = fakeTransport({});
		await makeClient(transport).request("/me", { body: {} });

		const { headers } = transport.mock.calls[0][1];
		expect(headers.Authorization).toBe("Token T");
		expect(headers["User-Agent"]).toBe("clubhouse/android");
		expect(headers["Content-Type"]).toMatch(/application\/json/);
	});

	it("throws a typed ApiError on a non-2xx, carrying the API message", async () => {
		const transport = fakeTransport({ error_message: "nope" }, { ok: false, status: 401 });
		await expect(makeClient(transport).request("/me", { body: {} })).rejects.toMatchObject({
			name: "ApiError",
			status: 401,
			message: "nope"
		});
	});

	it("treats HTTP 200 with success:false as a failure", async () => {
		const transport = fakeTransport({ success: false, error_message: "blocked" });
		await expect(makeClient(transport).request("/me", { body: {} })).rejects.toMatchObject({
			name: "ApiError",
			status: 200,
			message: "blocked"
		});
	});

	it("does not mistake a response with no success field for a failure", async () => {
		const transport = fakeTransport({ users: [] });
		await expect(makeClient(transport).request("/get_following")).resolves.toEqual({ users: [] });
	});

	it("turns a transport failure into an ApiError rather than leaking it", async () => {
		const transport = vi.fn().mockRejectedValue(new Error("ECONNRESET"));
		await expect(makeClient(transport).request("/me", { body: {} })).rejects.toBeInstanceOf(ApiError);
	});

	it("reports non-JSON responses clearly", async () => {
		const transport = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			text: async () => "<html>maintenance</html>"
		});
		await expect(makeClient(transport).request("/me", { body: {} })).rejects.toThrow(/not JSON/);
	});

	it("tolerates an empty body", async () => {
		const transport = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => "" });
		await expect(makeClient(transport).request("/leave_channel", { body: {} })).resolves.toEqual({});
	});
});

describe("endpoints", () => {
	it("sends the phone number for sign-in", async () => {
		const transport = fakeTransport({ success: true });
		await createApi(makeClient(transport)).startPhoneAuth("+15551234567");

		const [url, options] = transport.mock.calls[0];
		expect(url).toMatch(/\/start_phone_number_auth$/);
		expect(JSON.parse(options.body)).toEqual({ phone_number: "+15551234567" });
	});

	it("sends phone and code together on verify", async () => {
		const transport = fakeTransport({ success: true });
		await createApi(makeClient(transport)).completePhoneAuth("+15551234567", "123456");

		expect(JSON.parse(transport.mock.calls[0][1].body)).toEqual({
			phone_number: "+15551234567",
			verification_code: "123456"
		});
	});

	it("maps raiseHand to the audience_reply flags", async () => {
		const transport = fakeTransport({ success: true });
		const api = createApi(makeClient(transport));

		await api.raiseHand("room", true);
		expect(JSON.parse(transport.mock.calls[0][1].body)).toMatchObject({
			raise_hands: true,
			unraise_hands: false
		});

		await api.raiseHand("room", false);
		expect(JSON.parse(transport.mock.calls[1][1].body)).toMatchObject({
			raise_hands: false,
			unraise_hands: true
		});
	});

	it("sends privacy_level, spelled the way this API spells enums", async () => {
		// The server named the field ("Privacy level is required.") and then
		// rejected the lowercase value ('"open" is not a valid choice.') -
		// its other enums are uppercase, so that is the first spelling tried.
		const transport = fakeTransport({ success: true, channel: "C9" });
		await createApi(makeClient(transport)).createChannel({ topic: "TestRoom" });

		expect(transport).toHaveBeenCalledTimes(1);
		expect(JSON.parse(transport.mock.calls[0][1].body)).toMatchObject({
			topic: "TestRoom",
			privacy_level: "OPEN"
		});
	});

	it("walks the spellings when the server rejects the choice", async () => {
		const transport = vi
			.fn()
			.mockResolvedValueOnce({
				ok: true,
				status: 400,
				text: async () => JSON.stringify({ success: false, error_message: '"OPEN" is not a valid choice.' })
			})
			.mockResolvedValueOnce({
				ok: true,
				status: 200,
				text: async () => JSON.stringify({ success: true, channel: "C9" })
			});

		const result = await createApi(makeClient(transport)).createChannel({ topic: "t" });

		expect(result.channel).toBe("C9");
		expect(JSON.parse(transport.mock.calls[1][1].body)).toMatchObject({ privacy_level: "PUBLIC" });
	});

	it("gives up with the server's own words when no spelling passes", async () => {
		const transport = fakeTransport(
			{ success: false, error_message: '"open_room" is not a valid choice.' },
			{ status: 400, ok: true }
		);

		await expect(createApi(makeClient(transport)).createChannel({ topic: "t" })).rejects.toThrow(
			/not a valid choice/
		);
		// Every spelling for an open room was tried before giving up.
		expect(transport).toHaveBeenCalledTimes(4);
	});

	it("does not retry an error that is not about the choice", async () => {
		const transport = fakeTransport(
			{ success: false, error_message: "You are suspended." },
			{ status: 400, ok: true }
		);

		await expect(createApi(makeClient(transport)).createChannel({ topic: "t" })).rejects.toThrow(
			/suspended/
		);
		expect(transport).toHaveBeenCalledTimes(1);
	});

	it("maps the room kinds onto one privacy level", async () => {
		const transport = fakeTransport({ success: true });
		const api = createApi(makeClient(transport));

		await api.createChannel({ topic: "t", isPrivate: true });
		expect(JSON.parse(transport.mock.calls[0][1].body)).toMatchObject({ privacy_level: "CLOSED" });

		await api.createChannel({ topic: "t", isSocialMode: true });
		expect(JSON.parse(transport.mock.calls[1][1].body)).toMatchObject({ privacy_level: "SOCIAL" });
	});

	it("exposes every endpoint as a bound function", () => {
		const api = createApi(makeClient(fakeTransport({})));
		for (const name of ["me", "getFeed", "joinChannel", "leaveChannel", "searchUsers"]) {
			expect(typeof api[name], name).toBe("function");
		}
	});
});

describe("the feed", () => {
	it("POSTs to get_feed_v3, the endpoint that replaced get_channels", async () => {
		const transport = fakeTransport({ items: [], available_topics: [] });
		const api = createApi(makeClient(transport));

		await api.getFeed();

		const [url, options] = transport.mock.calls[0];
		expect(url).toContain("/get_feed_v3");
		expect(options.method).toBe("POST");
	});
});
