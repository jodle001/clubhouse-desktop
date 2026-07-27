/**
 * Minimal HTTP client for Clubhouse's private API.
 *
 * Replaces the `clubhouse-api` git dependency, which was unpinned (no tag, no
 * commit) and unmaintained, so every install took whatever that repo's default
 * branch happened to be.
 *
 * Transport is injected so tests can drive the whole client without a network.
 */

import { API_ROOT, buildHeaders } from "../profile.js";

export class ApiError extends Error {
	constructor(message, { status, endpoint, body } = {}) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.endpoint = endpoint;
		this.body = body;
	}
}

const defaultTransport = (url, options) => globalThis.fetch(url, options);

export class ClubhouseClient {
	/**
	 * @param {object} opts
	 * @param {() => object} opts.getSession returns { deviceId, userId, authToken }
	 * @param {Function} [opts.transport] fetch-compatible
	 * @param {string}   [opts.apiRoot]
	 * @param {Function} [opts.onRequest] observer for logging
	 */
	constructor({ getSession, transport = defaultTransport, apiRoot = API_ROOT, onRequest } = {}) {
		this.getSession = getSession || (() => ({}));
		this.transport = transport;
		this.apiRoot = apiRoot;
		this.onRequest = onRequest;
	}

	/**
	 * @param {string} endpoint e.g. "/get_channels"
	 * @param {object} [opts]
	 * @param {object} [opts.body]  present => POST
	 * @param {object} [opts.query] appended as a querystring
	 */
	async request(endpoint, { body, query } = {}) {
		let url = this.apiRoot + endpoint;

		if (query) {
			const params = new URLSearchParams();
			for (const [key, value] of Object.entries(query)) {
				if (value !== undefined && value !== null) {
					params.append(key, String(value));
				}
			}

			const qs = params.toString();
			if (qs) {
				url += `?${qs}`;
			}
		}

		const method = body === undefined ? "GET" : "POST";
		// Host is sent explicitly, in the position the original client sent it.
		const headers = buildHeaders({ ...this.getSession(), host: new URL(this.apiRoot).host });
		const options = { method, headers };

		if (body !== undefined) {
			headers["Content-Type"] = "application/json; charset=utf-8";
			options.body = JSON.stringify(body);
		}

		this.onRequest?.({ phase: "request", method, url, body });

		let response;
		try {
			response = await this.transport(url, options);
		} catch (cause) {
			throw new ApiError(`Could not reach Clubhouse: ${cause.message}`, { endpoint });
		}

		const text = await response.text();
		let data;
		try {
			data = text ? JSON.parse(text) : {};
		} catch {
			throw new ApiError("Clubhouse returned a response that was not JSON", {
				status: response.status,
				endpoint,
				body: text.slice(0, 200)
			});
		}

		this.onRequest?.({ phase: "response", method, url, status: response.status, data });

		if (!response.ok) {
			throw new ApiError(data.error_message || `Request failed with HTTP ${response.status}`, {
				status: response.status,
				endpoint,
				body: data
			});
		}

		// Clubhouse reports application-level failures as HTTP 200 with
		// { success: false, error_message }, so a 2xx on its own means nothing.
		// Checking it here makes every endpoint fail loudly; leaving it to each
		// caller meant only the two views that remembered to look ever noticed.
		if (data?.success === false) {
			throw new ApiError(data.error_message || "Clubhouse rejected the request", {
				status: response.status,
				endpoint,
				body: data
			});
		}

		return data;
	}
}
