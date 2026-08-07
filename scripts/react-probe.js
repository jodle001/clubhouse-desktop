#!/usr/bin/env node
/**
 * Why can this account react from the phone but not from here?
 *
 *   npm run probe:react -- --channel <name> [--target <user_id>]
 *
 * The account is the same in both places, so the per-account explanation is
 * dead: the server must be deciding by what the *client* claims to be. Every
 * attempt so far has claimed Android - the 2021 build and the current one -
 * and the phone that works is the iOS app. This script asks the same question
 * as several different clients and prints how the answer moves:
 *
 *   1. check_for_update with an iPhone User-Agent, which names the current
 *      iOS version and build - a real identity to claim, not a guess.
 *   2. /me under each identity, scanned for reaction-related experiment
 *      flags - if the flag follows the claimed client, this shows it.
 *   3. join_channel, for the room's reaction ids and capability grants
 *      (can_gif_react and friends).
 *   4. send_channel_reaction under each identity, then once more after
 *      re-joining under the iOS identity, in case the gate is evaluated
 *      when the channel session starts rather than per request.
 *   5. The other suspected paths: a gif reaction (user_capabilities grants
 *      can_gif_react, and gif_reaction events arrive over PubNub), and the
 *      chat pipeline (new_channel_reaction carries message_id, num_messages
 *      and message_type 6 - reactions live in the chat stream, so the phone
 *      may write them through it).
 *
 * Run it against a room of your own (the + Room button) so the test reactions
 * land where only you see them. Reactions aim at yourself unless --target
 * names somebody else. The script never leaves the channel, so an app session
 * in the same room stays undisturbed.
 */

import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { API_ROOT, APP_IDENTITY, IDENTITIES, buildHeaders } from "../src/shared/profile.js";
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
let target = null;

for (let i = 0; i < args.length; i++) {
	if (args[i] === "--channel") {
		channel = args[++i];
	} else if (args[i] === "--target") {
		target = Number(args[++i]);
	}
}

if (!channel) {
	console.error("\nUsage: npm run probe:react -- --channel <name> [--target <user_id>]");
	console.error("Make the room yourself (+ Room) so the test reactions are yours to see.\n");
	process.exit(1);
}

const session = loadSession();
const host = new URL(API_ROOT).host;

/** The app's headers, then the claimed identity swapped in place. */
function headersAs(identity, extra = {}) {
	const headers = buildHeaders({ ...session, host });
	headers["User-Agent"] = identity.userAgent;
	headers["CH-AppVersion"] = identity.appVersion;
	headers["CH-AppBuild"] = identity.appBuild;
	return Object.assign(headers, extra);
}

async function post(path, body, identity) {
	const response = await nodeTransport(API_ROOT + path, {
		method: "POST",
		headers: headersAs(identity, { "Content-Type": "application/json; charset=utf-8" }),
		body: JSON.stringify(body)
	});
	const text = await response.text();

	let data = null;
	try {
		data = JSON.parse(text);
	} catch {
		// A plain-text 404 is an unrouted path; keep the text for the verdict.
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

	return `${status} OK ${JSON.stringify(data).slice(0, 120)}`;
}

/** Every key path in a response whose name mentions reactions or gifs. */
function reactionFlags(value, path = "", out = []) {
	if (Array.isArray(value)) {
		value.forEach((element, i) => reactionFlags(element, `${path}[${i}]`, out));
	} else if (value && typeof value === "object") {
		for (const [key, child] of Object.entries(value)) {
			const here = path ? `${path}.${key}` : key;
			if (/reaction|gif/i.test(key)) {
				out.push(`${here} = ${JSON.stringify(child).slice(0, 100)}`);
			} else {
				reactionFlags(child, here, out);
			}
		}
	}

	return out;
}

function heading(text) {
	console.log(`\n${text}\n${"-".repeat(text.length)}`);
}

// --- 1. what does the server consider a current iPhone? --------------------

heading("Current iOS identity, from check_for_update");

// The 2021 iOS shape, old enough to be told to upgrade - the upgrade answer
// names today's version and build.
const iosSeed = {
	userAgent: "clubhouse/297 (iPhone; iOS 14.4; Scale/2.00)",
	appVersion: "0.1.28",
	appBuild: "297"
};

let ios = null;

{
	const response = await nodeTransport(`${API_ROOT}/check_for_update?is_testflight=0`, {
		headers: headersAs(iosSeed)
	});
	const data = JSON.parse(await response.text());
	console.log(JSON.stringify(data).slice(0, 300));

	if (data.app_build) {
		ios = {
			userAgent: `clubhouse/${data.app_build} (iPhone; iOS 17.5.1; Scale/3.00)`,
			appVersion: String(data.app_version),
			appBuild: String(data.app_build)
		};
		console.log(`claiming: ${ios.userAgent} v${ios.appVersion}`);
	} else {
		console.log("no build named; falling back to the seed identity");
		ios = iosSeed;
	}
}

const ladder = [
	["app default", APP_IDENTITY],
	["android-current", IDENTITIES["android-current"]],
	["ios-current", ios]
];

// --- 2. does the experiment flag follow the claimed client? -----------------

heading("Reaction flags in /me, per claimed identity");

for (const [name, identity] of ladder) {
	const me = await post("/me", {}, identity);
	const flags = reactionFlags(me.data || {});
	console.log(`\n${name} (${identity.userAgent}):`);
	console.log(flags.length ? flags.map(f => `  ${f}`).join("\n") : `  (none) ${verdict(me)}`);
}

// --- 3. the room's palette and grants ---------------------------------------

heading(`join_channel ${channel}`);

const joined = await post("/join_channel", { channel }, APP_IDENTITY);
if (!joined.data?.success) {
	console.error(`Could not join: ${verdict(joined)}`);
	process.exit(1);
}

const options = joined.data.reactions?.channel_reactions || [];
const reactionId = options[0]?.reaction_id ?? options[0]?.id ?? null;
const aimAt = target ?? joined.data.user_profile_id;

console.log(`reaction ids: ${JSON.stringify(options).slice(0, 200)}`);
console.log(
	`capabilities: ${JSON.stringify(
		Object.fromEntries(
			Object.entries(joined.data.user_capabilities || {}).filter(([k]) => /react|gif|chat/i.test(k))
		)
	)}`
);
console.log(`aiming at user ${aimAt}`);

if (reactionId == null) {
	console.log("\nThis room offers no reaction ids - use a room that does.");
	process.exit(1);
}

// --- 4. the same send, as each client ---------------------------------------

heading("send_channel_reaction, per claimed identity");

for (const [name, identity] of ladder) {
	const sent = await post(
		"/send_channel_reaction",
		{ channel, reaction_id: reactionId, target_user_id: aimAt },
		identity
	);
	console.log(`${name.padEnd(16)} ${verdict(sent)}`);
}

// The gate may be stamped onto the channel session when it starts, not read
// per request - so start the session as the phone would and ask again.
heading("after re-joining as ios-current");

const rejoined = await post("/join_channel", { channel }, ios);
console.log(`join: ${rejoined.data?.success ? "OK" : verdict(rejoined)}`);

const retried = await post(
	"/send_channel_reaction",
	{ channel, reaction_id: reactionId, target_user_id: aimAt },
	ios
);
console.log(`send: ${verdict(retried)}`);

// --- 5. the other suspected paths -------------------------------------------

heading("gif reaction (user_capabilities grants can_gif_react)");

// A mild giphy id seen live in a room. If any of these succeed, a gif lands
// in the room - which is why this runs against a room of your own.
const GIPHY = "cEb1tO6Xvn0DS";

for (const [path, body] of [
	["/send_channel_reaction", { channel, giphy_id: GIPHY, target_user_id: aimAt }],
	["/send_gif_reaction", { channel, giphy_id: GIPHY, target_user_id: aimAt }],
	["/send_channel_gif_reaction", { channel, giphy_id: GIPHY, target_user_id: aimAt }],
	["/gif_react", { channel, giphy_id: GIPHY, target_user_id: aimAt }]
]) {
	const sent = await post(path, body, ios);
	console.log(`${path.padEnd(28)} ${verdict(sent)}`);
}

heading("the chat pipeline (reactions carry message_type 6)");

// new_channel_reaction events have message_id and num_messages like chat
// lines do. If the phone writes reactions through the chat sender, the 400s
// will name the fields it wants; an empty message means nothing readable is
// posted even if one lands.
for (const body of [
	{ channel, message: "", message_type: 6, reaction_id: reactionId, target_user_id: aimAt },
	{ channel, message_type: 6, reaction_id: reactionId, target_user_id: aimAt }
]) {
	const sent = await post("/send_channel_message", body, ios);
	console.log(`${Object.keys(body).join(",").padEnd(52)} ${verdict(sent)}`);
}

console.log(
	"\nDone. Nothing left the channel - the app can stay in the room.\n" +
		"Paste this output back; the line that stops saying 'Feature flag' is the answer.\n"
);
