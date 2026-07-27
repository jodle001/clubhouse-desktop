/**
 * Auth state and the persistent device id, owned by the main process.
 *
 * The renderer never sees the token: it calls IPC, main attaches credentials.
 * That is what makes contextIsolation worth having.
 */

import Store from "electron-store";
import { newDeviceId } from "../shared/profile.js";

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

	get user() {
		return this.store.get("user") || null;
	}

	isSignedIn() {
		return Boolean(this.store.get("user")?.auth_token);
	}

	signIn(authResult) {
		this.store.set("user", authResult);
	}

	signOut() {
		this.store.delete("user");
	}

	/** Merge fresh tokens from /refresh_token without losing the profile. */
	updateTokens({ access, refresh }) {
		const user = this.user;
		if (!user) {
			return;
		}

		this.store.set("user", {
			...user,
			access_token: access ?? user.access_token,
			refresh_token: refresh ?? user.refresh_token
		});
	}
}
