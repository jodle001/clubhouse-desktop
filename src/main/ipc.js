/**
 * The renderer's entire view of the outside world.
 *
 * Every API method is exposed as one channel, and every call returns
 * { ok, data } or { ok: false, error } rather than throwing across the IPC
 * boundary - rejected promises lose their type and stack on the way over.
 */

import { ipcMain } from "electron";
import { ClubhouseClient } from "../shared/api/client.js";
import { endpoints } from "../shared/api/endpoints.js";
import { SERVICES } from "../shared/profile.js";

export function registerIpc({ session, settings, verbose = false }) {
	const client = new ClubhouseClient({
		getSession: () => session.credentials(),
		onRequest: verbose
			? event => {
				if (event.phase === "request") {
					console.log(`[api] -> ${event.method} ${event.url}`, redact(event.body));
				} else {
					console.log(`[api] <- ${event.status} ${event.url}`, redact(event.data));
				}
			}
			: undefined
	});

	// --- API ------------------------------------------------------------
	for (const [name, fn] of Object.entries(endpoints)) {
		ipcMain.handle(`api:${name}`, async (_event, ...args) => {
			try {
				const data = await fn(client, ...args);
				return { ok: true, data };
			} catch (error) {
				return {
					ok: false,
					error: { message: error.message, status: error.status ?? null }
				};
			}
		});
	}

	// --- session --------------------------------------------------------
	ipcMain.handle("session:get", () => ({
		signedIn: session.isSignedIn(),
		user: session.user,
		services: SERVICES
	}));

	ipcMain.handle("session:signIn", (_event, authResult) => {
		session.signIn(authResult);
		return { ok: true };
	});

	ipcMain.handle("session:signOut", () => {
		session.signOut();
		return { ok: true };
	});

	// --- settings -------------------------------------------------------
	ipcMain.handle("settings:get", () => settings.all());
	ipcMain.handle("settings:set", (_event, patch) => settings.update(patch));
}

/** Keeps credentials out of the terminal even in verbose mode. */
function redact(value) {
	if (!value || typeof value !== "object") {
		return value;
	}

	const clone = Array.isArray(value) ? [...value] : { ...value };
	for (const key of ["auth_token", "access_token", "refresh_token", "token", "rtm_token", "pubnub_token"]) {
		if (key in clone) {
			clone[key] = "<redacted>";
		}
	}

	return clone;
}
