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
import { nodeTransport } from "./transport.js";
import { redact } from "./redact.js";

export function registerIpc({ session, settings, verbose = false }) {
	const client = new ClubhouseClient({
		getSession: () => session.credentials(),
		// Not the global fetch: see transport.js for why that broke sign-in.
		transport: nodeTransport,
		onRequest: verbose
			? event => {
				if (event.phase === "request") {
					console.log(`[api] -> ${event.method} ${event.url}`, redact(event.body));
					// Whether Authorization is present, and which identity went
					// out, is usually the question when only some calls fail.
					console.log("      headers:", JSON.stringify(redact(event.headers)));
				} else if (event.raw !== undefined) {
					console.log(`[api] <- ${event.status} ${event.url} NOT JSON:`, event.raw.slice(0, 1000));
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

