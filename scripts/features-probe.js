#!/usr/bin/env node
/**
 * Learns the shapes behind discovery, waves, DMs and notifications in one run.
 *
 *   npm run probe:features                      # everything readable
 *   npm run probe:features -- --user 123456     # also shape a wave at a user
 *
 * The verb names are known (docs/api-endpoints.md); what these features need
 * is each endpoint's response shape and, for the mutations, its required
 * fields. Reads are shaped (types and nesting, never values, so the output is
 * safe to paste). Mutations go out empty on purpose - an empty body draws the
 * "X is required" that names the field, and sends nothing. A wave is only
 * actually sent if you pass --user AND --send, so by default nobody is waved.
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
let userArg = null;
let doSend = false;
for (let i = 0; i < args.length; i++) {
	if (args[i] === "--user") {
		userArg = Number(args[++i]);
	} else if (args[i] === "--send") {
		doSend = true;
	}
}

const session = loadSession();
const host = new URL(API_ROOT).host;

async function call(path, { method = "POST", body, query } = {}) {
	let url = API_ROOT + path;
	if (query) {
		const qs = new URLSearchParams(query).toString();
		if (qs) url += `?${qs}`;
	}

	const headers = buildHeaders({ ...session, host });
	const options = { method, headers };
	if (body !== undefined) {
		headers["Content-Type"] = "application/json; charset=utf-8";
		options.body = JSON.stringify(body);
	}

	const response = await nodeTransport(url, options);
	const text = await response.text();
	let data = null;
	try {
		data = JSON.parse(text);
	} catch {
		// plain-text 404
	}
	return { status: response.status, data, text };
}

const SENSITIVE = /token|phone|email|secret|password|auth|url|photo/i;

/** Types and nesting, not values. Arrays described by their first element. */
function shapeOf(value, depth = 0, indent = "  ") {
	if (value === null) return "null";
	if (Array.isArray(value)) {
		if (!value.length) return "array[0]";
		return `array[${value.length}] of ${shapeOf(value[0], depth + 1, indent + "  ")}`;
	}
	if (typeof value === "object") {
		if (depth >= 5) return "{…}";
		const lines = Object.entries(value).map(([k, v]) => {
			const rendered = SENSITIVE.test(k) ? `${typeof v} <hidden>` : shapeOf(v, depth + 1, indent + "  ");
			return `${indent}${k}: ${rendered}`;
		});
		return `{\n${lines.join("\n")}\n${indent.slice(2)}}`;
	}
	if (typeof value === "string") return "string";
	return typeof value;
}

function heading(text) {
	console.log(`\n${"=".repeat(3)} ${text} ${"=".repeat(Math.max(0, 40 - text.length))}`);
}

function verdict({ status, data }) {
	if (status === 404 && !data) return "gone (unrouted)";
	const why = data?.error_message || data?.detail || "";
	if (status >= 400 || data?.success === false) return `${status} refused${why ? `: ${why}` : ""}`;
	return `${status} OK`;
}

/** Try POST {} then GET for a read endpoint, print the shape of whichever answers. */
async function shape(path, { query } = {}) {
	heading(path);
	let res = await call(path, { body: {} });
	if (res.status === 405 || (res.status === 404 && !res.data)) {
		res = await call(path, { method: "GET", query: query || {} });
	}
	console.log(verdict(res));
	if (res.data) {
		console.log(shapeOf(res.data));
	} else if (res.text) {
		console.log(`(not JSON) ${res.text.slice(0, 120)}`);
	}
}

console.log(`\nIdentity: ${APP_IDENTITY.userAgent} v${APP_IDENTITY.appVersion} (${APP_IDENTITY.appBuild})`);
console.log(`Signed in as user ${session.userId ?? "(unknown)"}`);

// --- discovery --------------------------------------------------------------
await shape("/get_discovery_feed", { query: { page_size: 10, page: 1 } });

// --- waves ------------------------------------------------------------------
await shape("/get_received_waves");
await shape("/get_initiated_waves");

heading("send_wave (empty → names its field; sends nothing)");
console.log(verdict(await call("/send_wave", { body: {} })));
heading("initiate_wave (empty → names its field)");
console.log(verdict(await call("/initiate_wave", { body: {} })));

if (userArg && doSend) {
	heading(`send_wave field ladder at ${userArg} (stops at the first that takes)`);
	// { user_id } refused with an empty 400 in the app, so walk the recipient
	// fields the APK offers; the first accepted one names the field and sends
	// exactly one wave.
	for (const field of ["recipient_user_id", "to_user_profile_id", "user_profile_id", "to_user_id", "user_id"]) {
		const res = await call("/send_wave", { body: { [field]: userArg } });
		console.log(`${field.padEnd(20)} ${verdict(res)}`);
		if (res.status < 400 && res.data?.success !== false) {
			console.log(`  -> send_wave takes { ${field} }`);
			break;
		}
	}
} else if (userArg) {
	heading(`send_wave at ${userArg} would go here; pass --send to actually wave`);
}

// --- DMs / conversations ----------------------------------------------------
await shape("/get_chats", { query: { page_size: 10 } });

heading("create_conversation (empty → names its fields)");
console.log(verdict(await call("/create_conversation", { body: {} })));
heading("add_conversation_segment (empty → names its fields)");
console.log(verdict(await call("/add_conversation_segment", { body: {} })));
heading("get_conversation_segments (empty → names its fields)");
console.log(verdict(await call("/get_conversation_segments", { body: {} })));

// --- notifications ----------------------------------------------------------
await shape("/get_notifications", { query: { page_size: 10, page: 1 } });
await shape("/get_activities", { query: { page_size: 10, page: 1 } });

console.log("\nDone. Shapes are types only; paste the whole thing back.\n");
