import { describe, expect, it } from "vitest";
import { Session, stripTokens } from "../../src/main/session.js";

/** electron-store's surface, minus the disk. */
function fakeStore(initial = {}) {
	const data = { ...initial };
	return {
		get: key => data[key],
		set: (key, value) => (data[key] = value),
		delete: key => delete data[key],
		_data: data
	};
}

const AUTH_RESULT = {
	success: true,
	auth_token: "AUTH",
	access_token: "ACCESS",
	refresh_token: "REFRESH",
	is_verified: true,
	user_profile: { user_id: 7, name: "Me", username: "me" }
};

describe("stripTokens", () => {
	it("removes every credential and keeps the person", () => {
		const stripped = stripTokens(AUTH_RESULT);

		expect(stripped.auth_token).toBeUndefined();
		expect(stripped.access_token).toBeUndefined();
		expect(stripped.refresh_token).toBeUndefined();
		expect(stripped.user_profile).toEqual(AUTH_RESULT.user_profile);
		expect(stripped.is_verified).toBe(true);
	});

	it("does not mutate its input", () => {
		const input = { ...AUTH_RESULT };
		stripTokens(input);
		expect(input.auth_token).toBe("AUTH");
	});

	it("passes non-objects through", () => {
		expect(stripTokens(null)).toBeNull();
		expect(stripTokens(undefined)).toBeUndefined();
	});
});

describe("Session", () => {
	it("stores the full result but answers publicly without tokens", () => {
		const session = new Session(fakeStore({ deviceId: "D" }));
		session.signIn(AUTH_RESULT);

		// Internal: credentials for signing requests still work.
		expect(session.credentials()).toEqual({ deviceId: "D", userId: 7, authToken: "AUTH" });
		expect(session.isSignedIn()).toBe(true);

		// External: what session:get sends over the bridge carries none.
		expect(session.publicUser.auth_token).toBeUndefined();
		expect(session.publicUser.refresh_token).toBeUndefined();
		expect(session.publicUser.user_profile.user_id).toBe(7);
	});

	it("keeps its tokens when the renderer sends a stripped update", () => {
		// The renderer only ever holds stripped copies. Its session:signIn
		// (profile edits, waitlist state) must not erase the credentials main
		// captured at sign-in - that would sign the user out as a side effect.
		const session = new Session(fakeStore({ deviceId: "D" }));
		session.signIn(AUTH_RESULT);

		session.signIn({
			user_profile: { user_id: 7, name: "Renamed", username: "me" },
			is_verified: true
		});

		expect(session.credentials().authToken).toBe("AUTH");
		expect(session.user.user_profile.name).toBe("Renamed");
		expect(session.isSignedIn()).toBe(true);
	});

	it("prefers fresh tokens when a new sign-in carries them", () => {
		const session = new Session(fakeStore({ deviceId: "D" }));
		session.signIn(AUTH_RESULT);
		session.signIn({ ...AUTH_RESULT, auth_token: "NEWER" });

		expect(session.credentials().authToken).toBe("NEWER");
	});

	it("signs out completely", () => {
		const session = new Session(fakeStore({ deviceId: "D" }));
		session.signIn(AUTH_RESULT);
		session.signOut();

		expect(session.isSignedIn()).toBe(false);
		expect(session.user).toBeNull();
		expect(session.credentials().authToken).toBeUndefined();
	});

	it("mints a device id once and keeps it", () => {
		const store = fakeStore();
		const session = new Session(store);
		const first = session.deviceId;

		expect(first).toMatch(/^[0-9A-F-]{36}$/i);
		expect(new Session(store).deviceId).toBe(first);
	});
});
