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

	it("passes through non-objects untouched", () => {
		expect(redact(undefined)).toBeUndefined();
		expect(redact("plain")).toBe("plain");
		expect(redact(null)).toBe(null);
	});
});
