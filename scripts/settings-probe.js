#!/usr/bin/env node
/**
 * Confirms the request bodies for the room-settings verbs.
 *
 *   npm run probe:settings -- --channel <name>
 *
 * The verb names are no longer a guess - they were read out of the Android app
 * (see docs/api-endpoints.md): enable_channel_messages / disable_channel_messages
 * for room chat, set_chat_permission, change_handraise_settings,
 * update_handraise_queue_setting, set_channel_title. What is still unknown is
 * the exact field each wants, so this sends the plausible body for each real
 * verb and reads the room back to see the setting move, restoring anything it
 * changed.
 *
 * Run it against a room you started (+ Room); it changes that room's settings.
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
	const response = await nodeTransport(API_ROOT + path, { method: "POST", headers, body: JSON.stringify(body) });
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
	const joined = await post("/join_channel", { channel, attribution_source: "feed", attribution_details: "e30=" });
	const d = joined.data || {};
	return {
		ok: ok(joined),
		is_chat_enabled: d.is_chat_enabled,
		chat_permission: d.chat_permission,
		is_handraise_enabled: d.is_handraise_enabled,
		handraise_permission: d.handraise_permission,
		handraise_queue_setting: d.handraise_queue_setting,
		topic: d.topic
	};
}

/**
 * Send the plausible bodies for one known verb until one is accepted, print
 * each verdict, then read the room back to show whether `field` moved.
 * Returns the winning body.
 */
async function confirm(title, path, bodies, field) {
	heading(title);

	for (const body of bodies) {
		const result = await post(path, body);
		const shown = Object.entries(body).filter(([k]) => k !== "channel").map(([k, v]) => `${k}=${v}`).join(" ");
		console.log(`${path.padEnd(30)} ${shown.padEnd(42)} ${verdict(result)}`);

		if (ok(result)) {
			const after = await readSettings();
			console.log(`  -> ${field} is now ${JSON.stringify(after[field])}`);
			return body;
		}
	}

	return null;
}

console.log(`\nIdentity: ${APP_IDENTITY.userAgent} v${APP_IDENTITY.appVersion} (${APP_IDENTITY.appBuild})`);

const before = await readSettings();
if (!before.ok) {
	console.error("Could not join the room.");
	process.exit(1);
}

heading(`current settings for ${channel}`);
console.log(JSON.stringify(before));

// --- room chat: the switch a host needs -------------------------------------

const chatOn = await confirm(
	"enable_channel_messages (a hosted room starts with chat off)",
	"/enable_channel_messages",
	[{ channel }, { channel, is_enabled: true }],
	"is_chat_enabled"
);

// Who may chat, while chat is on.
await confirm(
	"set_chat_permission (1 everyone, 2 host's followers, 3 trusted)",
	"/set_chat_permission",
	[
		{ channel, chat_permission: 2 },
		{ channel, permission: 2 },
		{ channel, chat_permission_option: 2 }
	],
	"chat_permission"
);

// Put chat back the way it was.
if (chatOn && before.is_chat_enabled === false) {
	await post("/disable_channel_messages", chatOn.is_enabled === undefined ? { channel } : { channel, is_enabled: false });
	console.log("  (restored chat to off)");
}

// --- hand-raise -------------------------------------------------------------

await confirm(
	"change_handraise_settings",
	"/change_handraise_settings",
	[
		{ channel, is_handraise_enabled: true, handraise_permission: 1 },
		{ channel, is_enabled: true, handraise_permission: 1 },
		{ channel, is_handraise_enabled: true }
	],
	"is_handraise_enabled"
);

await confirm(
	"update_handraise_queue_setting",
	"/update_handraise_queue_setting",
	[
		{ channel, handraise_queue_setting: 1 },
		{ channel, queue_setting: 1 }
	],
	"handraise_queue_setting"
);

// Restore hand-raise to what it was.
await post("/change_handraise_settings", {
	channel,
	is_handraise_enabled: Boolean(before.is_handraise_enabled),
	handraise_permission: before.handraise_permission ?? 0
}).catch(() => {});
await post("/update_handraise_queue_setting", { channel, handraise_queue_setting: before.handraise_queue_setting ?? 0 }).catch(() => {});

// --- rename -----------------------------------------------------------------

await confirm(
	"set_channel_title",
	"/set_channel_title",
	[
		{ channel, title: `${before.topic} ` },
		{ channel, channel_title: `${before.topic} ` },
		{ channel, topic: `${before.topic} ` }
	],
	"topic"
);

// Put the title back exactly.
for (const key of ["title", "channel_title", "topic"]) {
	const back = await post("/set_channel_title", { channel, [key]: before.topic });
	if (ok(back)) {
		console.log(`  (restored title via ${key})`);
		break;
	}
}

console.log("\nDone. Settings were restored where a verb was found. Paste the output back.\n");
