#!/usr/bin/env node
/**
 * Learns how room polls are created and voted on.
 *
 *   npm run probe:poll -- --channel <name>
 *
 * join_channel describes polls fully - is_channel_user_poll_enabled, a
 * channel_user_poll block with validation rules and colours, a
 * selected_poll_option_id on each user, can_manage_channel_user_poll in the
 * capabilities - but not the field names create and vote want. This asks the
 * server to name them the way it named privacy_level and the reaction fields:
 * one 400 at a time.
 *
 * It creates a real poll in the room and votes on it, so run it against a room
 * you started (+ Room). The poll is visible to anyone in the room; end the
 * room afterwards to clear it. A poll is created only if one is not already
 * active, and voting aims at the poll's own first option.
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
	console.error("\nUsage: npm run probe:poll -- --channel <name>");
	console.error("Make the room yourself (+ Room) so the test poll is yours to clear.\n");
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
		// A plain-text 404 is an unrouted path; the status still tells the tale.
	}

	return { status: response.status, data, text };
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

function ok(result) {
	return result.status < 400 && result.data?.success !== false;
}

function heading(text) {
	console.log(`\n${text}\n${"-".repeat(text.length)}`);
}

console.log(`\nIdentity: ${APP_IDENTITY.userAgent} v${APP_IDENTITY.appVersion} (${APP_IDENTITY.appBuild})`);
console.log(`Signed in as user ${session.userId ?? "(unknown)"}`);

// --- the room's own poll description ----------------------------------------

heading(`join_channel ${channel}`);

const joined = await post("/join_channel", { channel, attribution_source: "feed", attribution_details: "e30=" });
if (!ok(joined)) {
	console.error(`Could not join: ${verdict(joined)}`);
	process.exit(1);
}

console.log(`is_channel_user_poll_enabled: ${joined.data.is_channel_user_poll_enabled}`);
console.log(`can_manage_channel_user_poll: ${joined.data.user_capabilities?.can_manage_channel_user_poll}`);
console.log(`channel_user_poll: ${JSON.stringify(joined.data.channel_user_poll)?.slice(0, 400)}`);

// Content that satisfies the validation rules the room reported (title 5-80,
// option 5-30), so a rejection is about field names, not lengths.
const title = "Which fruit is the best for a snack?";
const optionTexts = ["Apples", "Oranges", "Bananas"];

// --- create: let the server name the fields it wants ------------------------

heading("create_channel_user_poll - field-name ladder");

// Ordered plainest-first. Each is only sent if the ones before it were still
// missing a field; the first that is accepted (or fails on something other
// than a missing field) stops the ladder.
const createBodies = [
	{ channel, title, options: optionTexts },
	{ channel, title, poll_options: optionTexts },
	{ channel, title, options: optionTexts.map(text => ({ text })) },
	{ channel, title, options: optionTexts.map((text, i) => ({ text, sort_priority: i })) },
	{ channel, question: title, options: optionTexts },
	{ channel, poll_title: title, poll_options: optionTexts }
];

let created = null;
for (const body of createBodies) {
	const result = await post("/create_channel_user_poll", body);
	const shape = Object.entries(body)
		.filter(([k]) => k !== "channel")
		.map(([k, v]) => `${k}=${Array.isArray(v) ? JSON.stringify(v).slice(0, 40) : v}`)
		.join(" ");
	console.log(`${shape.slice(0, 60).padEnd(62)} ${verdict(result)}`);

	if (ok(result)) {
		created = result;
		break;
	}

	// "already active" is a success for our purposes: a poll exists to read
	// and vote on, so stop asking to make another.
	if (/already|active|exists/i.test(result.data?.error_message || "")) {
		console.log("  (a poll is already active - reading that one)");
		break;
	}
}

// --- read it back, for the option ids vote will need ------------------------

heading("get_channel_user_poll");

const got = await post("/get_channel_user_poll", { channel });
console.log(`${verdict(got)}`);
if (got.data) {
	console.log(JSON.stringify(got.data).slice(0, 600));
}

/** Find every value under a key matching `re`, anywhere in the payload. */
function valuesUnder(re, value, out = []) {
	if (Array.isArray(value)) {
		value.forEach(v => valuesUnder(re, v, out));
	} else if (value && typeof value === "object") {
		for (const [k, v] of Object.entries(value)) {
			if (re.test(k) && (typeof v === "number" || typeof v === "string")) {
				out.push(v);
			} else {
				valuesUnder(re, v, out);
			}
		}
	}

	return out;
}

const source = created?.data || got.data || {};
const ids = [...new Set(valuesUnder(/^poll_option_id$/, source))];
const pollId = valuesUnder(/^poll_id$/, source)[0] || null;
console.log(`\npoll_id: ${pollId ?? "(none found)"}`);
console.log(`option ids seen: ${ids.length ? ids.join(", ") : "(none found - shape above)"}`);

// --- vote: /vote_channel_user_poll 404s, so it is the verb name that is
// wrong, not the fields. The payload calls the option poll_option_id; carry
// that and the poll_id and walk the plausible names. ------------------------

if (ids.length) {
	heading("vote - endpoint-name ladder");

	const body = { channel, poll_id: pollId, poll_option_id: ids[0] };
	const paths = [
		"/vote_in_channel_user_poll",
		"/submit_channel_user_poll_vote",
		"/create_channel_user_poll_vote",
		"/channel_user_poll_vote",
		"/cast_channel_user_poll_vote",
		"/select_channel_user_poll_option",
		"/set_channel_user_poll_vote",
		"/answer_channel_user_poll",
		"/vote_for_channel_user_poll_option",
		"/add_channel_user_poll_vote",
		"/update_channel_user_poll_vote",
		"/set_selected_poll_option"
	];

	let voted = false;
	for (const path of paths) {
		const result = await post(path, body);
		console.log(`${path.padEnd(40)} ${verdict(result)}`);
		if (ok(result)) {
			console.log(`  -> voted via ${path} { poll_id, poll_option_id }`);
			voted = true;
			break;
		}
	}

	// Read the tallies back, so a silent 200 is confirmed to have counted.
	if (voted) {
		const after = await post("/get_channel_user_poll", { channel });
		console.log(`\nresults after voting: ${JSON.stringify(after.data?.channel_user_poll?.poll_results || after.data?.poll_results)?.slice(0, 300)}`);
	}
} else {
	console.log("\nNo option id to vote with - the create/get shape above is the thing to read.");
}

console.log("\nDone. The poll (if created) lives in the room until you end it.\n");
