#!/usr/bin/env node
/**
 * Learns the endpoints behind a room's settings.
 *
 *   npm run probe:settings -- --channel <name>
 *
 * join_channel reports a room's settings in full - is_chat_enabled and
 * chat_permission, is_handraise_enabled / handraise_permission, the
 * privacy_settings, can_edit_room_title - but not the verbs that change them.
 * A freshly hosted room even comes back with chat off, which is why a host
 * sees no chat panel and has no way to turn it on. This asks the server to
 * name each mutation the way it named privacy_level and the poll verbs: one
 * 400 (or a flipped field) at a time.
 *
 * It changes settings on the room, so run it against a room you started
 * (+ Room). Each section reads the room back to show whether the field moved,
 * and restores anything it flipped (chat back off, privacy back to public).
 */

import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { API_ROOT, APP_IDENTITY, buildHeaders } from "../src/shared/profile.js";
import { nodeTransport } from "../src/main/transport.js";

const PRODUCT = "Clubhouse Desktop";

function sessionPath() {
	if (process.platform === "darwin") {
		return join(homedir(), "Library", "Application Support", PRODUCT, "session.json");
	}

	if (process.platform === "win32") {
		return join(process.env.APPDATA || join(homedir(), "AppData", "Roaming"), PRODUCT, "session.json");
	}

	return join(process.env.XDG_CONFIG_HOME || join(homedir(), ".config"), PRODUCT, "session.json");
}

function loadSession() {
	try {
		const store = JSON.parse(readFileSync(sessionPath(), "utf8"));
		return {
			deviceId: store.deviceId,
			userId: store.user?.user_profile?.user_id,
			authToken: store.user?.auth_token
		};
	} catch {
		console.error(`\nNo signed-in session at ${sessionPath()}\nSign in with \`npm start\` first.\n`);
		process.exit(1);
	}
}

const args = process.argv.slice(2);
let channel = null;
for (let i = 0; i < args.length; i++) {
	if (args[i] === "--channel") {
		channel = args[++i];
	}
}

if (!channel) {
	console.error("\nUsage: npm run probe:settings -- --channel <name>");
	console.error("Make the room yourself (+ Room) so the settings are yours to change.\n");
	process.exit(1);
}

const session = loadSession();
const host = new URL(API_ROOT).host;

async function post(path, body) {
	const headers = buildHeaders({ ...session, host });
	headers["Content-Type"] = "application/json; charset=utf-8";
	const response = await nodeTransport(API_ROOT + path, {
		method: "POST",
		headers,
		body: JSON.stringify(body)
	});
	const text = await response.text();

	let data = null;
	try {
		data = JSON.parse(text);
	} catch {
		// A plain-text 404 is an unrouted path.
	}

	return { status: response.status, data };
}

function ok(result) {
	return result.status < 400 && result.data?.success !== false;
}

function verdict({ status, data }) {
	if (status === 404 && !data) {
		return "gone (unrouted)";
	}

	const why = data?.error_message || data?.detail || "";
	if (status >= 400 || data?.success === false) {
		return `${status} refused${why ? `: ${why}` : ""}`;
	}

	return `${status} OK`;
}

function heading(text) {
	console.log(`\n${text}\n${"-".repeat(text.length)}`);
}

/** The room's current settings, the fields these verbs move. */
async function readSettings() {
	const joined = await post("/join_channel", {
		channel,
		attribution_source: "feed",
		attribution_details: "e30="
	});

	const d = joined.data || {};
	return {
		ok: ok(joined),
		is_chat_enabled: d.is_chat_enabled,
		chat_permission: d.chat_permission,
		is_handraise_enabled: d.is_handraise_enabled,
		handraise_permission: d.handraise_permission,
		privacy: d.privacy_settings?.type,
		topic: d.topic,
		caps: d.user_capabilities || {}
	};
}

console.log(`\nIdentity: ${APP_IDENTITY.userAgent} v${APP_IDENTITY.appVersion} (${APP_IDENTITY.appBuild})`);

const before = await readSettings();
if (!before.ok) {
	console.error("Could not join the room.");
	process.exit(1);
}

heading(`current settings for ${channel}`);
console.log(JSON.stringify(before, null, 0));

/**
 * Walk a set of (path, body) attempts. Stops at the first that is accepted or
 * fails on something other than a missing route/field, printing each verdict.
 * Returns the winning attempt, if any.
 */
async function ladder(title, attempts, confirm) {
	heading(title);

	for (const [path, body] of attempts) {
		const result = await post(path, body);
		const shown = Object.entries(body)
			.filter(([k]) => k !== "channel")
			.map(([k, v]) => `${k}=${v}`)
			.join(" ");
		console.log(`${path.padEnd(38)} ${shown.padEnd(28)} ${verdict(result)}`);

		if (ok(result)) {
			if (confirm) {
				const after = await readSettings();
				console.log(`  -> ${confirm}: ${JSON.stringify(confirm.split(",").reduce((o, k) => ((o[k.trim()] = after[k.trim()]), o), {}))}`);
			}
			return { path, body };
		}
	}

	return null;
}

// --- chat: the one that blocks a host from seeing chat ----------------------

const chatWin = await ladder(
	"enable chat (a hosted room starts with is_chat_enabled false)",
	[
		["/change_channel_is_chat_enabled", { channel, is_enabled: true }],
		["/change_channel_is_chat_enabled", { channel, is_chat_enabled: true }],
		["/update_channel_chat", { channel, is_chat_enabled: true }],
		["/change_channel_chat_mode", { channel, chat_permission: 1 }],
		["/set_channel_chat_permission", { channel, chat_permission: 1 }],
		["/update_chat_permission", { channel, chat_permission: 1 }],
		["/enable_channel_chat", { channel }],
		["/change_channel_chat", { channel, is_chat_enabled: true, chat_permission: 1 }]
	],
	"is_chat_enabled,chat_permission"
);

// Put chat back the way it was, if we turned it on and know the verb.
if (chatWin && before.is_chat_enabled === false) {
	const off = { ...chatWin.body };
	if ("is_enabled" in off) off.is_enabled = false;
	if ("is_chat_enabled" in off) off.is_chat_enabled = false;
	// chat_permission has no "off"; disabling is a different field, so only
	// restore the boolean forms.
	if ("is_enabled" in chatWin.body || "is_chat_enabled" in chatWin.body) {
		await post(chatWin.path, off);
		console.log("  (restored chat to off)");
	}
}

// --- hand-raise mode --------------------------------------------------------

await ladder(
	"hand-raise permission",
	[
		["/change_handraise_permission", { channel, handraise_permission: 1 }],
		["/change_channel_handraise_permission", { channel, handraise_permission: 1 }],
		["/update_channel_handraise", { channel, is_handraise_enabled: true }],
		["/set_handraise_permission", { channel, handraise_permission: 1 }],
		["/change_channel_is_handraise_enabled", { channel, is_enabled: true }]
	],
	"is_handraise_enabled,handraise_permission"
);

// Restore hand-raise to what it was, best effort.
if (before.handraise_permission !== undefined) {
	await post("/change_handraise_permission", { channel, handraise_permission: before.handraise_permission }).catch(() => {});
}

// --- privacy (public / social / private), the 2021 verbs and newer shapes ---

const privacyWin = await ladder(
	"privacy - change to private, then restore",
	[
		["/change_channel_privacy", { channel, privacy_level: "PRIVATE" }],
		["/update_channel_privacy", { channel, privacy_level: "PRIVATE" }],
		["/make_channel_private", { channel }],
		["/set_channel_privacy", { channel, privacy_level: "PRIVATE" }],
		["/change_privacy", { channel, privacy_level: "PRIVATE" }]
	],
	"privacy"
);

// Always try to put it back to public.
if (privacyWin && before.privacy) {
	for (const [path, body] of [
		[privacyWin.path, { channel, privacy_level: "PUBLIC" }],
		["/make_channel_public", { channel }]
	]) {
		const back = await post(path, body);
		if (ok(back)) {
			console.log(`  (restored privacy to public via ${path})`);
			break;
		}
	}
}

// --- room title -------------------------------------------------------------

await ladder(
	"edit the room title",
	[
		["/change_channel_topic", { channel, topic: before.topic }],
		["/update_channel_topic", { channel, topic: before.topic }],
		["/edit_channel_topic", { channel, topic: before.topic }],
		["/change_channel_title", { channel, title: before.topic }]
	],
	"topic"
);

console.log("\nDone. Settings were restored where a verb was found. Paste the output back.\n");
