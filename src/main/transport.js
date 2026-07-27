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
 * @param {string} url
 * @param {{method?: string, headers?: object, body?: string}} [options]
 * @returns {Promise<{ok: boolean, status: number, text: () => Promise<string>}>}
 */
export function nodeTransport(url, { method = "GET", headers = {}, body } = {}) {
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
				const stream = decoder(res.headers["content-encoding"]);
				const source = stream ? res.pipe(stream) : res;

				let text = "";
				source.setEncoding("utf8");
				source.on("data", chunk => (text += chunk));
				source.on("end", () => resolve(toResponse(res, text)));
				source.on("error", reject);
			}
		);

		req.on("error", reject);
		req.end(payload ?? undefined);
	});
}
