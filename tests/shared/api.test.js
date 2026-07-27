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

	it("exposes every endpoint as a bound function", () => {
		const api = createApi(makeClient(fakeTransport({})));
		for (const name of ["me", "getChannels", "joinChannel", "leaveChannel", "searchUsers"]) {
			expect(typeof api[name], name).toBe("function");
		}
	});
});
