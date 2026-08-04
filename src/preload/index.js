/**
 * The only bridge between the renderer and the outside world.
 *
 * Exposes a fixed, explicit surface - no `ipcRenderer`, no `require`, no
 * arbitrary channel names. The surface is endpoints.js itself: ipc.js
 * registers a handler per endpoint from that same object, so the two sides
 * cannot drift - a hand-maintained copy here once could, silently, and the
 * test bridge would have papered over it.
 */

import { contextBridge, ipcRenderer } from "electron";
import { endpoints } from "../shared/api/endpoints.js";

const API_METHODS = Object.keys(endpoints);

const api = {};
for (const name of API_METHODS) {
	api[name] = (...args) => ipcRenderer.invoke(`api:${name}`, ...args);
}

// One line, so "the bridge never loaded" - the failure that presents as a
// blank page - is distinguishable from everything else in a verbose log.
console.log(`[preload] bridge exposed (${API_METHODS.length} methods, sandboxed: ${process.sandboxed})`);

contextBridge.exposeInMainWorld("clubhouse", {
	api,
	session: {
		get: () => ipcRenderer.invoke("session:get"),
		signIn: authResult => ipcRenderer.invoke("session:signIn", authResult),
		signOut: () => ipcRenderer.invoke("session:signOut")
	},
	settings: {
		get: () => ipcRenderer.invoke("settings:get"),
		set: patch => ipcRenderer.invoke("settings:set", patch)
	},
	platform: process.platform
});
