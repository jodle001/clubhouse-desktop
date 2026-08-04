import { describe, expect, it } from "vitest";
import { redact } from "../../src/main/redact.js";

describe("redact", () => {
	it("hides every token the API hands back", () => {
		const signIn = {
			success: true,
			auth_token: "AUTH",
			access_token: "ACCESS",
			refresh_token: "REFRESH",
			user_profile: { name: "Someone" }
		};

		const safe = redact(signIn);
		const printed = JSON.stringify(safe);

		expect(printed).not.toContain("AUTH");
		expect(printed).not.toContain("ACCESS");
		expect(printed).not.toContain("REFRESH");
		expect(safe.success).toBe(true);
		expect(safe.user_profile.name).toBe("Someone");
	});

	it("hides the Authorization header but keeps the scheme", () => {
		const safe = redact({ "User-Agent": "clubhouse/android", Authorization: "Token SECRET" });

		expect(JSON.stringify(safe)).not.toContain("SECRET");
		expect(safe.Authorization).toBe("Token <redacted>");
		expect(safe["User-Agent"]).toBe("clubhouse/android");
	});

	it("hides it whatever case the header name has", () => {
		expect(redact({ authorization: "Token SECRET" }).authorization).toBe("Token <redacted>");
	});

	it("leaves a request with no Authorization visibly without one", () => {
		// Distinguishing "token missing" from "token hidden" is the whole point
		// of logging headers.
		expect(redact({ "CH-UserID": "(null)" })).toEqual({ "CH-UserID": "(null)" });
	});

	it("does not mutate what it was given", () => {
		const original = { auth_token: "AUTH" };
		redact(original);
		expect(original.auth_token).toBe("AUTH");
	});

	it("finds a token however deeply the response nests it", () => {
		// users[n].pubnub_token is exactly as live as a top-level one; the old
		// shallow pass printed it verbatim.
		const deep = {
			users: [{ name: "A" }, { name: "B", pubnub_token: "NESTED" }],
			channel: { inner: { token: "DEEPER" } }
		};

		const printed = JSON.stringify(redact(deep));
		expect(printed).not.toContain("NESTED");
		expect(printed).not.toContain("DEEPER");
		expect(printed).toContain('"A"');
	});

	it("hides the refresh request's body", () => {
		// The /refresh_token request sends { refresh } - the one name the old
		// key list missed, in exactly the log meant for pasting into issues.
		expect(redact({ refresh: "LIVE" }).refresh).toBe("<redacted>");
	});

	it("hides the phone number and code, which together take an account over", () => {
		const body = { phone_number: "+15551234567", verification_code: "123456" };
		const printed = JSON.stringify(redact(body));

		expect(printed).not.toContain("5551234567");
		expect(printed).not.toContain("123456");
	});

	it("passes through non-objects untouched", () => {
		expect(redact(undefined)).toBeUndefined();
		expect(redact("plain")).toBe("plain");
		expect(redact(null)).toBe(null);
	});
});
