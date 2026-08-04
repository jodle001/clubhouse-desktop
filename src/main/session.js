/**
 * Auth state and the persistent device id, owned by the main process.
 *
 * The renderer never sees the token: it calls IPC, main attaches credentials.
 * That is what makes contextIsolation worth having - and it is enforced here,
 * not merely intended. Everything that leaves this class for the renderer goes
 * through stripTokens(), and the sign-in result is captured in ipc.js before
 * the renderer ever receives it.
 */

import Store from "electron-store";
import { newDeviceId } from "../shared/profile.js";

/** Every key Clubhouse has ever used for a credential. */
const TOKEN_KEYS = ["auth_token", "access_token", "refresh_token"];

/** A copy safe to hand to the renderer: the person, minus the credentials. */
export function stripTokens(user) {
	if (!user || typeof user !== "object") {
		return user;
	}

	const clone = { ...user };
	for (const key of TOKEN_KEYS) {
		delete clone[key];
	}

	return clone;
}

export class Session {
	constructor(store = new Store({ name: "session" })) {
		this.store = store;

		if (!this.store.get("deviceId")) {
			this.store.set("deviceId", newDeviceId());
		}
	}

	get deviceId() {
		return this.store.get("deviceId");
	}

	/** Shape the API client asks for on every request. */
	credentials() {
		const user = this.store.get("user");
		return {
			deviceId: this.deviceId,
			userId: user?.user_profile?.user_id,
			authToken: user?.auth_token
		};
	}

	/** Full record, tokens included. Never send this over IPC. */
	get user() {
		return this.store.get("user") || null;
	}

	/** What session:get answers with. */
	get publicUser() {
		return stripTokens(this.user);
	}

	isSignedIn() {
		return Boolean(this.store.get("user")?.auth_token);
	}

	/**
	 * Store a sign-in. Token fields are only ever accepted from the API
	 * response captured in main - anything arriving from the renderer has been
	 * stripped, so merging keeps the credentials this class already holds
	 * rather than letting a tokenless update erase them.
	 */
	signIn(authResult) {
		const existing = this.store.get("user") || {};
		const kept = {};
		for (const key of TOKEN_KEYS) {
			if (authResult?.[key]) {
				kept[key] = authResult[key];
			} else if (existing[key]) {
				kept[key] = existing[key];
			}
		}

		this.store.set("user", { ...stripTokens(authResult), ...kept });
	}

	signOut() {
		this.store.delete("user");
	}
}
