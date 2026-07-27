/**
 * The application identity this client presents to Clubhouse's private API.
 *
 * The project originally sent the March 2021 iOS build (0.1.28 / build 304).
 * Raising that to the current iOS build cleared `check_for_update`, but
 * `start_phone_number_auth` still answered:
 *
 *   login did not pass token validation!
 *
 * Clubhouse's support docs describe that error as an unsupported device or OS.
 * Apple's DeviceCheck / App Attest is iOS-only, so a request claiming to be an
 * iPhone can be asked for a hardware-signed token that no desktop can produce.
 *
 * Clubdeck - a desktop client that does still sign in - avoids that by
 * identifying as Android instead. The values below are its identity, recovered
 * from its bundle and cross-checked against four strings whose values were
 * already known (the Agora key and the three PubNub values), which pinned the
 * obfuscator's string-array rotation exactly.
 *
 * The Agora and PubNub credentials are byte-identical to the ones this project
 * already used, so only the identity headers differ.
 *
 * Note that `userAgentStatic` is absent on purpose: the request agent in
 * clubhouse-api never reads it.
 */

/**
 * CH-DeviceId is sent on every request. With no value here the API client mints
 * a fresh UUID per call, so one session looks like dozens of separate devices -
 * a good way to trip anti-abuse. Persist one per install instead.
 */
function uuidv4() {
	const bytes = new Uint8Array(16);
	if (typeof crypto !== "undefined" && crypto.getRandomValues) {
		crypto.getRandomValues(bytes);
	} else {
		for (let i = 0; i < 16; i++) {
			bytes[i] = Math.floor(Math.random() * 256);
		}
	}

	// RFC 4122 version and variant bits.
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

function stableDeviceId() {
	try {
		if (typeof localStorage === "undefined") {
			// Node (scripts/doctor.js) - the caller supplies its own.
			return undefined;
		}

		let id = localStorage.getItem("deviceId");
		if (!id) {
			id = uuidv4();
			localStorage.setItem("deviceId", id);
		}

		return id;
	} catch (_) {
		return undefined;
	}
}

const AppProfile = {
	apiRoot: "https://www.clubhouseapi.com/api",

	// --- application identity -------------------------------------------
	// was: "clubhouse/304 (iPhone; iOS 14.4; Scale/2.00)"
	userAgent: "clubhouse/android",
	// was: "0.1.28"
	appVersion: "0.1.8",
	// was: "304"
	appBuild: "2576",
	// Stable per install, rather than a new UUID on every request.
	deviceId: stableDeviceId(),
	// ---------------------------------------------------------------------

	// Unchanged, and confirmed byte-identical to what Clubdeck sends.
	agoraKey: "938de3e8055e42b281bb8c6f69c21f78",
	pubnubRoot: "https://clubhouse.pubnub.com",
	pubnubPubKey: "pub-c-6878d382-5ae6-4494-9099-f930f938868b",
	pubnubSubKey: "sub-c-a4abea84-9ca3-11ea-8e71-f2b83ac9263d",
	// Upstream's typo, kept verbatim - Clubdeck sends the same string.
	pubnubSDK: "PubNFub-ObjC-iOS/4.15.11"
};

export default AppProfile;
