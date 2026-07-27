/**
 * The application identity this client presents to Clubhouse's private API.
 *
 * Clubhouse refuses sign-in from anything claiming to be an iPhone with
 * "login did not pass token validation" - Apple's DeviceCheck / App Attest is
 * iOS-only, so an iOS client can be asked for a hardware-signed token that no
 * desktop can produce. Identifying as Android avoids that check entirely.
 *
 * These values were recovered from Clubdeck, a desktop client that does still
 * sign in, and cross-checked against four strings whose values were already
 * known (the Agora key and the three PubNub values).
 */

// `process` is absent in the renderer, which bundles this module for SERVICES.
const env = typeof process !== "undefined" ? (process.env ?? {}) : {};

/** Overridable so scripts/probe.js can be exercised against a stub API. */
export const API_ROOT = env.CLUBHOUSE_API_ROOT || "https://www.clubhouseapi.com/api";

/**
 * Clubhouse can accept a sign-in request (`success: true`, `is_blocked: false`)
 * and then simply not send the text. There is no field that says so, which
 * makes the identity the first thing to vary when no code arrives.
 *
 * Pick one with CLUBHOUSE_IDENTITY, so trying another is a restart rather than
 * a code change:
 *
 *   CLUBHOUSE_IDENTITY=android npm start -- --verbose
 */
export const IDENTITIES = Object.freeze({
	// Clubdeck's, recovered from its bundle. The default because Clubdeck is a
	// desktop client known to work, and this set did deliver a code here once.
	clubdeck: { userAgent: "clubhouse/android", appVersion: "0.1.8", appBuild: "2576" },

	// The same build, but with the User-Agent in the shape real Android clients
	// use. `clubhouse/android` came out of an obfuscated string table, which
	// stores fragments - the app may well append the build at runtime, in which
	// case what we send is truncated.
	"clubdeck-ua": { userAgent: "clubhouse/android/2576", appVersion: "0.1.8", appBuild: "2576" },

	// A later Android identity, as used by clubhouse-py.
	android: { userAgent: "clubhouse/android/3389", appVersion: "1.0.1", appBuild: "3389" }
});

export const DEFAULT_IDENTITY = "clubdeck";

/** Unknown names fall back to the default rather than sending nothing. */
export function resolveIdentity(name) {
	return Object.freeze({ ...(IDENTITIES[name] || IDENTITIES[DEFAULT_IDENTITY]) });
}

export const APP_IDENTITY = resolveIdentity(env.CLUBHOUSE_IDENTITY);

/** Credentials for the services Clubhouse hosts its rooms and signalling on. */
export const SERVICES = Object.freeze({
	agoraAppId: "938de3e8055e42b281bb8c6f69c21f78",
	pubnubOrigin: "https://clubhouse.pubnub.com",
	pubnubPublishKey: "pub-c-6878d382-5ae6-4494-9099-f930f938868b",
	pubnubSubscribeKey: "sub-c-a4abea84-9ca3-11ea-8e71-f2b83ac9263d"
});

/**
 * CH-DeviceId must be stable. Left to the API client it would be a fresh UUID
 * per request, making one session look like dozens of devices.
 */
export function newDeviceId(randomUUID = globalThis.crypto?.randomUUID) {
	if (typeof randomUUID === "function") {
		return randomUUID.call(globalThis.crypto).toUpperCase();
	}

	const bytes = new Uint8Array(16);
	for (let i = 0; i < 16; i++) {
		bytes[i] = Math.floor(Math.random() * 256);
	}

	bytes[6] = (bytes[6] & 0x0f) | 0x40;
	bytes[8] = (bytes[8] & 0x3f) | 0x80;

	const hex = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
	return [
		hex.slice(0, 8),
		hex.slice(8, 12),
		hex.slice(12, 16),
		hex.slice(16, 20),
		hex.slice(20)
	]
		.join("-")
		.toUpperCase();
}

/**
 * Headers every request carries, given a session.
 *
 * The set and the insertion order both reproduce what the original client sent
 * (clubhouse-api's `agent.js`), because that request demonstrably got a code
 * delivered and the current one does not. Header order is part of how a server
 * fingerprints a client, so it is not incidental - keep it.
 *
 * `host` is supplied by the transport, which knows the URL.
 */
export function buildHeaders({
	deviceId,
	userId,
	authToken,
	locale = "en_US",
	language = "en-US",
	host
} = {}) {
	const headers = {
		"User-Agent": APP_IDENTITY.userAgent,
		"CH-Languages": language,
		"CH-Locale": locale,
		"CH-AppVersion": APP_IDENTITY.appVersion,
		"CH-AppBuild": APP_IDENTITY.appBuild,
		"CH-DeviceId": deviceId || "(null)",
		"CH-UserID": userId == null ? "(null)" : String(userId)
	};

	if (authToken) {
		headers.Authorization = `Token ${authToken}`;
	}

	headers.Accept = "application/json";
	headers["Accept-Encoding"] = "gzip, deflate, br";
	headers["Accept-Language"] = "en-US;q=1";
	headers.Connection = "keep-alive";

	if (host) {
		headers.Host = host;
	}

	return headers;
}
