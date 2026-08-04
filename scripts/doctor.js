#!/usr/bin/env node
/**
 * Environment and backend check.
 *
 *   npm run doctor
 *
 * Probes Clubhouse's API with the same identity the app sends, so a failure
 * here means the app would fail the same way.
 */

import { createRequire } from "node:module";
import { API_ROOT, APP_IDENTITY, buildHeaders, newDeviceId } from "../src/shared/profile.js";
import { nodeTransport } from "../src/main/transport.js";

const require = createRequire(import.meta.url);
const apiRoot = process.env.CLUBHOUSE_API_ROOT || API_ROOT;

function heading(text) {
	console.log(`\n${text}\n${"-".repeat(text.length)}`);
}

function version(pkg) {
	try {
		return require(`${pkg}/package.json`).version;
	} catch {
		return "not installed";
	}
}

heading("Environment");
console.log(`node       ${process.version}`);
console.log(`platform   ${process.platform} ${process.arch}`);
console.log(`electron   ${version("electron")}`);
console.log(`vue        ${version("vue")}`);

heading("Clubhouse API");
console.log(`endpoint   ${apiRoot}/check_for_update`);
console.log(`identity   ${APP_IDENTITY.userAgent}  v${APP_IDENTITY.appVersion} (${APP_IDENTITY.appBuild})\n`);

const started = Date.now();
let response;

try {
	// The app's own transport, not global fetch: undici adds sec-fetch-*
	// headers no native app sends, which is the exact fingerprint difference
	// that once made requests "succeed" while Clubhouse silently dropped them.
	// A doctor probing with different headers than the patient proves nothing.
	response = await nodeTransport(`${apiRoot}/check_for_update?is_testflight=0`, {
		headers: buildHeaders({ deviceId: newDeviceId() }),
		timeout: 15000
	});
} catch (error) {
	console.log(`FAIL       ${error.message}`);
	console.log("\nThe API host could not be reached from here.");
	process.exit(1);
}

const body = await response.text();
console.log(`HTTP ${response.status}  (${Date.now() - started}ms)`);
console.log(`body: ${body.slice(0, 400) || "(empty)"}`);

if (/allowlist|egress|proxy|blocked by/i.test(body)) {
	console.log("\nThat reply came from a network proxy, not Clubhouse.");
	process.exit(1);
}

let parsed;
try {
	parsed = JSON.parse(body);
} catch {
	console.log("\nThe response was not JSON - the API has likely changed shape.");
	process.exit(1);
}

heading("Verdict");

if (response.ok && parsed.has_update === false) {
	console.log("The API accepts this client's identity.");
	console.log("Note this endpoint is unauthenticated, so it says nothing about sign-in.");
} else if (parsed.has_update) {
	console.log(`The API wants build ${parsed.app_build} (${parsed.app_version}).`);
	console.log(`This client sends ${APP_IDENTITY.appBuild}. See src/shared/profile.js.`);
	process.exitCode = 1;
} else {
	console.log(`Unexpected reply (HTTP ${response.status}).`);
	process.exitCode = 1;
}
