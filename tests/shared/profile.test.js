import { describe, expect, it } from "vitest";
import {
	APP_IDENTITY,
	buildHeaders,
	IDENTITIES,
	newDeviceId,
	resolveIdentity,
	SERVICES
} from "@shared/profile.js";

describe("app identity", () => {
	it("presents as Android, not iOS", () => {
		// iOS identities are refused with "login did not pass token validation"
		// because Apple's DeviceCheck is iOS-only and no desktop can satisfy it.
		expect(APP_IDENTITY.userAgent).toBe("clubhouse/android");
		expect(APP_IDENTITY.userAgent).not.toMatch(/iPhone|iOS/i);
	});

	it("pins the build the API accepts", () => {
		expect(APP_IDENTITY.appVersion).toBe("0.1.8");
		expect(APP_IDENTITY.appBuild).toBe("2576");
	});

	it("can be swapped for another identity by name", () => {
		expect(resolveIdentity("android")).toMatchObject({
			userAgent: "clubhouse/android/3389",
			appVersion: "1.0.1",
			appBuild: "3389"
		});
	});

	it("falls back to the default rather than sending nothing", () => {
		expect(resolveIdentity("nonsense")).toEqual(resolveIdentity("clubdeck"));
		expect(resolveIdentity(undefined).appBuild).toBe("2576");
	});

	it("never offers an iOS identity, whichever is picked", () => {
		for (const identity of Object.values(IDENTITIES)) {
			expect(identity.userAgent).not.toMatch(/iPhone|iOS/i);
		}
	});
});

describe("buildHeaders", () => {
	it("sends the identity on every request", () => {
		const h = buildHeaders({ deviceId: "D", userId: 7 });
		expect(h["User-Agent"]).toBe("clubhouse/android");
		expect(h["CH-AppBuild"]).toBe("2576");
		expect(h["CH-AppVersion"]).toBe("0.1.8");
		expect(h["CH-DeviceId"]).toBe("D");
		expect(h["CH-UserID"]).toBe("7");
	});

	it("omits Authorization when signed out", () => {
		expect(buildHeaders({}).Authorization).toBeUndefined();
	});

	it("adds a Token header when signed in", () => {
		expect(buildHeaders({ authToken: "abc" }).Authorization).toBe("Token abc");
	});

	it("uses (null) placeholders rather than undefined", () => {
		const h = buildHeaders();
		expect(h["CH-DeviceId"]).toBe("(null)");
		expect(h["CH-UserID"]).toBe("(null)");
	});
});

describe("newDeviceId", () => {
	it("produces an uppercase RFC 4122 v4 UUID", () => {
		expect(newDeviceId()).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/);
	});

	it("works without crypto.randomUUID", () => {
		expect(newDeviceId(undefined)).toMatch(/^[0-9A-F-]{36}$/);
	});

	it("does not repeat", () => {
		const ids = new Set(Array.from({ length: 50 }, () => newDeviceId()));
		expect(ids.size).toBe(50);
	});
});

describe("service credentials", () => {
	it("keeps the Agora app id in exactly one place", () => {
		expect(SERVICES.agoraAppId).toBe("938de3e8055e42b281bb8c6f69c21f78");
	});
});
