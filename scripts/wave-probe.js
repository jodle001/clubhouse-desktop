#!/usr/bin/env node
/**
 * Is waving blocked by the client version, or by something server-side?
 *
 *   npm run probe:wave -- --user <a friend's user_id>
 *
 * The wave contract is now exact - read from the app itself (jadx):
 * send_wave takes { to_user_profile_id, source } with source an uppercase
 * SourceLocation. Sent verbatim, it still 400s with an empty error, so the
 * payload is not the problem. This sends that same body while claiming each
 * app identity in turn - the 2021 build this client uses, the current Android
 * build, and a current iOS build - to see whether a newer version is accepted
 * where 2576 is refused. It actually sends a wave, so aim it at a friend whose
 * profile shows can_wave: true.
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
let target = null;
for (let i = 0; i < args.length; i++) {
	if (args[i] === "--user") {
		target = Number(args[++i]);
	}
}

if (!target) {
	console.error("\nUsage: npm run probe:wave -- --user <friend's user_id>");
	console.error("Pick someone whose profile shows can_wave: true.\n");
	process.exit(1);
}

const session = loadSession();
const host = new URL(API_ROOT).host;

function headersAs(identity) {
	const headers = buildHeaders({ ...session, host });
	headers["User-Agent"] = identity.userAgent;
	headers["CH-AppVersion"] = identity.appVersion;
	headers["CH-AppBuild"] = identity.appBuild;
	headers["Content-Type"] = "application/json; charset=utf-8";
	return headers;
}

async function sendWave(identity, source) {
	const response = await nodeTransport(`${API_ROOT}/send_wave`, {
		method: "POST",
		headers: headersAs(identity),
		body: JSON.stringify({ to_user_profile_id: target, source })
	});
	const text = await response.text();
	let data = null;
	try {
		data = JSON.parse(text);
	} catch {
		// plain text
	}
	const why = data?.error_message ?? "";
	const ok = response.status < 400 && data?.success !== false;
	return `${response.status} ${ok ? "OK" : `refused${why ? `: ${why}` : " (empty error)"}`}`;
}

// The iOS build the server currently names, derived live.
const iosSeed = { userAgent: "clubhouse/297 (iPhone; iOS 14.4; Scale/2.00)", appVersion: "0.1.28", appBuild: "297" };
let ios = iosSeed;
{
	const res = await nodeTransport(`${API_ROOT}/check_for_update?is_testflight=0`, { headers: headersAs(iosSeed) });
	const data = JSON.parse(await res.text());
	if (data.app_build) {
		ios = {
			userAgent: `clubhouse/${data.app_build} (iPhone; iOS 17.5.1; Scale/3.00)`,
			appVersion: String(data.app_version),
			appBuild: String(data.app_build)
		};
	}
}

const ladder = [
	["app default", APP_IDENTITY],
	["android-current", IDENTITIES["android-current"]],
	["ios-current", ios]
];

console.log(`\nWaving at ${target} with { to_user_profile_id, source }, per identity:\n`);
for (const [name, identity] of ladder) {
	console.log(`${name.padEnd(16)} (${identity.appBuild})  ${await sendWave(identity, "PROFILE")}`);
}

// If a version is accepted, maybe only the source differs on the old one -
// try a couple of other valid SourceLocation values on the app's own identity.
console.log("\nOther source values on the app's own identity:");
for (const source of ["WAVE", "WAVE_AT_FRIENDS", "BUDDY_LIST", "WHOS_ONLINE", "FRIEND_TAB"]) {
	console.log(`  source=${source.padEnd(16)} ${await sendWave(APP_IDENTITY, source)}`);
}

console.log("\nThe line that stops saying 'empty error' is the answer.\n");
