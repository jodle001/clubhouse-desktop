/**
 * Keeps credentials out of the terminal in verbose mode.
 *
 * Its own module because verbose output is meant to be pasted into bug reports
 * and chat windows, so a hole here leaks a live session token to whoever reads
 * it. That deserves tests, and ipc.js cannot be imported outside Electron.
 */

const SECRET_KEYS = [
	"auth_token",
	"access_token",
	"refresh_token",
	// The refresh_token *request* sends it under this name (see endpoints.js),
	// so missing it printed a live refresh token into exactly these logs.
	"refresh",
	"token",
	"rtm_token",
	"pubnub_token",
	// Not credentials, but the pair below is an account takeover while the
	// code is valid - and the person most likely to paste a verbose log into
	// a public issue is the one debugging sign-in.
	"phone_number",
	"verification_code"
];

export function redact(value) {
	if (!value || typeof value !== "object") {
		return value;
	}

	// Recursive, because responses nest: a token at users[3].pubnub_token is
	// exactly as live as one at the top level, and shallow redaction printed
	// it verbatim.
	if (Array.isArray(value)) {
		return value.map(redact);
	}

	const clone = {};

	for (const [key, entry] of Object.entries(value)) {
		if (SECRET_KEYS.includes(key)) {
			clone[key] = "<redacted>";
			continue;
		}

		// Headers carry the token too. Keep the scheme, so a missing or
		// malformed Authorization header stays visible - that is often the
		// thing being diagnosed.
		if (key.toLowerCase() === "authorization" && typeof entry === "string") {
			const [scheme] = entry.split(" ");
			clone[key] = `${scheme} <redacted>`;
			continue;
		}

		clone[key] = redact(entry);
	}

	return clone;
}
