import { createServer } from "node:http";
import { gzipSync } from "node:zlib";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { nodeTransport } from "../../src/main/transport.js";
import { ClubhouseClient } from "@shared/api/client.js";

let server;
let root;
let lastRequest;

beforeAll(async () => {
	server = createServer((req, res) => {
		let body = "";
		req.on("data", chunk => (body += chunk));
		req.on("end", () => {
			lastRequest = { method: req.method, url: req.url, rawHeaders: req.rawHeaders, body };

			if (req.url.endsWith("/gzipped")) {
				res.writeHead(200, { "Content-Type": "application/json", "Content-Encoding": "gzip" });
				res.end(gzipSync(JSON.stringify({ success: true, compressed: true })));
				return;
			}

			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ success: true }));
		});
	});

	await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
	root = `http://127.0.0.1:${server.address().port}/api`;
});

afterAll(() => server.close());

/** Header names exactly as they went over the wire. */
function sentHeaderNames() {
	return lastRequest.rawHeaders.filter((_, i) => i % 2 === 0);
}

describe("nodeTransport", () => {
	it("sends no Sec-Fetch-* headers", async () => {
		// The reason this transport exists. Node's global fetch adds
		// `sec-fetch-mode: cors` to every request; no native app sends that,
		// and Clubhouse silently stopped delivering codes when it appeared.
		await nodeTransport(`${root}/x`, { method: "POST", headers: { Accept: "application/json" }, body: "{}" });

		expect(sentHeaderNames().some(name => /^sec-/i.test(name))).toBe(false);
	});

	it("keeps the given headers, in the order they were given", async () => {
		await nodeTransport(`${root}/x`, {
			method: "POST",
			headers: { "User-Agent": "clubhouse/android", "CH-AppBuild": "2576", Accept: "application/json" },
			body: "{}"
		});

		const names = sentHeaderNames();
		const given = names.filter(n => ["User-Agent", "CH-AppBuild", "Accept"].includes(n));
		expect(given).toEqual(["User-Agent", "CH-AppBuild", "Accept"]);
	});

	it("sends Content-Length rather than chunking the body", async () => {
		// Node defaults a written body to Transfer-Encoding: chunked, which no
		// real client does here.
		await nodeTransport(`${root}/x`, { method: "POST", headers: {}, body: '{"a":1}' });

		const names = sentHeaderNames();
		expect(names).toContain("Content-Length");
		expect(names).not.toContain("Transfer-Encoding");
		expect(lastRequest.body).toBe('{"a":1}');
	});

	it("preserves header name casing", async () => {
		await nodeTransport(`${root}/x`, { headers: { "CH-DeviceId": "D" } });
		expect(sentHeaderNames()).toContain("CH-DeviceId");
	});

	it("decompresses a gzipped response", async () => {
		const response = await nodeTransport(`${root}/gzipped`);
		expect(JSON.parse(await response.text())).toEqual({ success: true, compressed: true });
	});

	it("reports a non-2xx through ok/status rather than throwing", async () => {
		const response = await nodeTransport(`${root}/x`, { method: "POST", headers: {}, body: "{}" });
		expect(response.ok).toBe(true);
		expect(response.status).toBe(200);
	});

	it("rejects rather than hanging when the host is unreachable", async () => {
		await expect(nodeTransport("http://127.0.0.1:1/nope")).rejects.toThrow();
	});
});

describe("the client over this transport", () => {
	it("sends the identity, Host and no browser headers", async () => {
		const client = new ClubhouseClient({
			getSession: () => ({ deviceId: "DEV-1" }),
			transport: nodeTransport,
			apiRoot: root
		});

		await client.request("/start_phone_number_auth", { body: { phone_number: "+15550001111" } });

		const names = sentHeaderNames();
		expect(names).toContain("CH-AppBuild");
		expect(names).toContain("Host");
		expect(names).toContain("Accept-Encoding");
		expect(names.some(name => /^sec-/i.test(name))).toBe(false);
		expect(lastRequest.body).toBe('{"phone_number":"+15550001111"}');
	});
});
