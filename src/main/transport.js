/**
 * A fetch-shaped transport built on node:https, used instead of the global
 * fetch for every Clubhouse request.
 *
 * Node's fetch is undici, which implements the Fetch standard - and that
 * standard says to send `Sec-Fetch-Mode`. So every request carried
 * `sec-fetch-mode: cors`, a header no native mobile app has ever sent. It is
 * exactly the kind of signal used to tell a real app from a script, and after
 * the rewrite moved requests from the renderer (node-fetch, which sends no such
 * header) into the main process, Clubhouse began accepting sign-in requests -
 * `success: true`, `is_blocked: false`, `error_message: null` - and then
 * silently dispatching neither the SMS nor the voice call.
 *
 * node:https sends precisely the headers it is given and nothing else, which is
 * what the original client did.
 */

import { Buffer } from "node:buffer";
import { request as httpsRequest } from "node:https";
import { request as httpRequest } from "node:http";
import { createBrotliDecompress, createGunzip, createInflate } from "node:zlib";

/** Matches the subset of Response the API client uses. */
function toResponse(res, text) {
	return {
		ok: res.statusCode >= 200 && res.statusCode < 300,
		status: res.statusCode,
		headers: res.headers,
		text: async () => text
	};
}

function decoder(encoding) {
	switch ((encoding || "").trim().toLowerCase()) {
		case "gzip":
		case "x-gzip":
			return createGunzip();
		case "deflate":
			return createInflate();
		case "br":
			return createBrotliDecompress();
		default:
			return null;
	}
}

/**
 * The response body, decompressed. Content-Encoding may list more than one
 * coding ("gzip, br"), applied left to right, so they are undone in reverse.
 * An unknown coding among them means the body cannot be safely decoded, so it
 * is left as-is rather than half-decoded - the old single-token switch turned
 * any multi-coding header into raw compressed bytes read as text.
 */
function decodedBody(res) {
	const header = (res.headers["content-encoding"] || "").trim();
	if (!header) {
		return res;
	}

	const codings = header
		.toLowerCase()
		.split(",")
		.map(part => part.trim())
		.filter(Boolean);

	let stream = res;
	for (const coding of codings.reverse()) {
		const step = decoder(coding);
		if (!step) {
			return res;
		}

		stream = stream.pipe(step);
	}

	return stream;
}

/** Long enough for a slow mobile API, short enough that the UI is not stuck. */
const TIMEOUT_MS = 30000;

/**
 * @param {string} url
 * @param {{method?: string, headers?: object, body?: string, timeout?: number}} [options]
 * @returns {Promise<{ok: boolean, status: number, text: () => Promise<string>}>}
 */
export function nodeTransport(url, { method = "GET", headers = {}, body, timeout = TIMEOUT_MS } = {}) {
	const target = new URL(url);
	const send = target.protocol === "http:" ? httpRequest : httpsRequest;
	const payload = body === undefined ? null : Buffer.from(body);

	// Without an explicit length Node falls back to `Transfer-Encoding: chunked`.
	// The original client always sent Content-Length, and a chunked POST is one
	// more way to look unlike the app we are claiming to be.
	const finalHeaders = payload
		? { ...headers, "Content-Length": String(payload.length) }
		: headers;

	return new Promise((resolve, reject) => {
		const req = send(
			target,
			{
				method,
				// Node writes these in insertion order, so the caller controls
				// the request exactly.
				headers: finalHeaders
			},
			res => {
				const source = decodedBody(res);

				let text = "";
				source.setEncoding("utf8");
				source.on("data", chunk => (text += chunk));
				source.on("end", () => resolve(toResponse(res, text)));
				source.on("error", reject);

				// pipe() does not forward errors: a socket that dies mid-body
				// on a compressed response would error on `res`, unpipe, and
				// leave the zlib stream waiting forever for data that is never
				// coming - a promise that neither resolves nor rejects.
				if (source !== res) {
					res.on("error", reject);
				}
			}
		);

		// A server that accepts the connection and never answers would
		// otherwise hang the request - and the caller's spinner - forever.
		req.setTimeout(timeout, () => {
			req.destroy(new Error(`No response within ${Math.round(timeout / 1000)}s`));
		});

		req.on("error", reject);
		req.end(payload ?? undefined);
	});
}
