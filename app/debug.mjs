/**
 * Opt-in request logging. Off unless the app is started with --verbose:
 *
 *   npm start -- --verbose
 *
 * The app's own console.log calls mostly log objects, which arrive in the main
 * process as "[object Object]" and are useless. Logging at the transport layer
 * instead gives the real request and response for every API call, regardless of
 * how any given view happens to log.
 *
 * cross-fetch resolves to node-fetch in this renderer, so every API call goes
 * through require('https').request.
 */

const https = require("https");
const http = require("http");

const MAX_BODY = 4000;

// Never print credentials, so a pasted log cannot leak a session.
const SECRETS = /("(?:auth_token|access_token|refresh_token|rtm_token|pubnub_token|token)"\s*:\s*")[^"]*(")/g;

export function redact(text) {
	return String(text).replace(SECRETS, "$1<redacted>$2");
}

export function isVerbose() {
	try {
		return process.argv.includes("--verbose");
	} catch (_) {
		return false;
	}
}

function patch(mod, name) {
	const real = mod.request.bind(mod);
	if (mod.request.__apiLogged) {
		return;
	}

	const wrapped = function(options, callback) {
		const opts = typeof options === "string" ? { path: options } : options || {};
		const method = String(opts.method || "GET").toUpperCase();
		const target = `${opts.hostname || opts.host || ""}${opts.path || ""}`;
		let sent = "";

		const req = real(options, res => {
			let body = "";
			res.on("data", chunk => {
				if (body.length < MAX_BODY) {
					body += chunk;
				}
			});
			res.on("end", () => {
				console.log(
					`[api] <- ${res.statusCode} ${method} ${target}\n      ${redact(body) || "(empty)"}`
				);
			});

			if (callback) {
				callback(res);
			}
		});

		req.on("error", err => console.log(`[api] !! ${method} ${target}: ${err.message}`));

		const write = req.write.bind(req);
		req.write = (chunk, ...rest) => {
			if (chunk && typeof chunk !== "function") {
				sent += chunk;
			}

			return write(chunk, ...rest);
		};

		const end = req.end.bind(req);
		req.end = (chunk, ...rest) => {
			if (chunk && typeof chunk !== "function") {
				sent += chunk;
			}

			console.log(`[api] -> ${method} ${name}://${target}${sent ? `  ${redact(sent)}` : ""}`);
			return end(chunk, ...rest);
		};

		return req;
	};

	wrapped.__apiLogged = true;
	mod.request = wrapped;
}

export function installRequestLogging() {
	if (!isVerbose()) {
		return false;
	}

	patch(https, "https");
	patch(http, "http");
	console.log("[api] verbose request logging enabled");
	return true;
}
