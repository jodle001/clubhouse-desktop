#!/usr/bin/env node
"use strict";

/**
 * Environment + backend check for the unofficial Clubhouse desktop client.
 *
 * The client talks to Clubhouse's private mobile API using the headers of the
 * March 2021 iOS build (app build 304). That API is not public and is not
 * versioned for third parties, so the most useful thing this script can tell
 * you is whether the endpoints the app depends on still answer today.
 *
 * Run with: npm run doctor
 */

const https = require("https");
const { URL } = require("url");

const PROFILE = {
	apiRoot: "https://www.clubhouseapi.com/api",
	userAgent: "clubhouse/304 (iPhone; iOS 14.4; Scale/2.00)",
	appVersion: "0.1.28",
	appBuild: "304"
};

const TIMEOUT_MS = 15000;

function request(path) {
	return new Promise(resolve => {
		const url = new URL(PROFILE.apiRoot + path);
		const started = Date.now();

		const req = https.request(
			{
				method: "GET",
				hostname: url.hostname,
				path: url.pathname + url.search,
				headers: {
					"User-Agent": PROFILE.userAgent,
					"CH-Languages": "en-US",
					"CH-Locale": "en_US",
					"CH-AppVersion": PROFILE.appVersion,
					"CH-AppBuild": PROFILE.appBuild,
					"CH-DeviceId": "00000000-0000-0000-0000-000000000000",
					"CH-UserID": "(null)",
					Accept: "application/json",
					"Accept-Language": "en-US;q=1"
				}
			},
			res => {
				let body = "";
				res.on("data", chunk => {
					body += chunk;
				});
				res.on("end", () =>
					resolve({
						status: res.statusCode,
						body: body.slice(0, 500),
						ms: Date.now() - started
					})
				);
			}
		);

		req.setTimeout(TIMEOUT_MS, () => {
			req.destroy();
			resolve({ error: `timed out after ${TIMEOUT_MS}ms` });
		});
		req.on("error", err => resolve({ error: err.message }));
		req.end();
	});
}

function heading(text) {
	console.log(`\n${text}`);
	console.log("-".repeat(text.length));
}

(async () => {
	heading("Environment");
	console.log(`node      ${process.version}`);
	console.log(`platform  ${process.platform} ${process.arch}`);
	try {
		console.log(`electron  ${require("electron/package.json").version}`);
	} catch (_) {
		console.log("electron  not installed (run: npm install)");
	}

	heading("Clubhouse API reachability");
	console.log(`endpoint  ${PROFILE.apiRoot}/check_for_update`);
	console.log(`sending   CH-AppBuild: ${PROFILE.appBuild} (March 2021 iOS build)\n`);

	const result = await request("/check_for_update?is_testflight=0");

	if (result.error) {
		console.log(`FAIL      ${result.error}`);
		console.log(
			"\nThe API host could not be reached. Check your network, or whether\n" +
				"www.clubhouseapi.com still resolves from here."
		);
		process.exitCode = 1;
		return;
	}

	console.log(`HTTP ${result.status}  (${result.ms}ms)`);
	console.log(`body: ${result.body || "(empty)"}`);

	// A corporate proxy or sandbox can answer instead of Clubhouse; say so
	// rather than blaming the API.
	if (/allowlist|egress|proxy|blocked by|access denied by/i.test(result.body)) {
		console.log(
			"\nThis response came from a network proxy, not from Clubhouse. Allow\n" +
				"www.clubhouseapi.com through your egress rules and run this again."
		);
		process.exitCode = 1;
	} else if (result.status >= 200 && result.status < 300) {
		console.log(
			"\nThe endpoint answered. Note that a 2xx here does not guarantee that\n" +
				"login or joining rooms still works - those need a valid account and\n" +
				"may be rejected separately for using an outdated app build."
		);
	} else if (result.status === 401 || result.status === 403) {
		console.log(
			"\nThe API rejected this app build. Clubhouse is refusing requests that\n" +
				"identify as build 304, so signing in through this client will not work\n" +
				"without updating the profile in clubhouse-api to a current build."
		);
		process.exitCode = 1;
	} else if (result.status === 426 || /update/i.test(result.body)) {
		console.log(
			"\nThe API is asking for an app upgrade. This client's build headers are\n" +
				"too old to be accepted."
		);
		process.exitCode = 1;
	} else {
		console.log(
			"\nUnexpected response. The private API has most likely changed shape\n" +
				"since this client was written in 2021."
		);
		process.exitCode = 1;
	}
})();
