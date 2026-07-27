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
	"token",
	"rtm_token",
	"pubnub_token"
];

export function redact(value) {
	if (!value || typeof value !== "object") {
		return value;
	}

	const clone = Array.isArray(value) ? [...value] : { ...value };

	for (const key of SECRET_KEYS) {
		if (key in clone) {
			clone[key] = "<redacted>";
		}
	}

	// Headers carry the token too. Keep the scheme, so a missing or malformed
	// Authorization header stays visible - that is often the thing being
	// diagnosed.
	for (const key of Object.keys(clone)) {
		if (key.toLowerCase() === "authorization" && typeof clone[key] === "string") {
			const [scheme] = clone[key].split(" ");
			clone[key] = `${scheme} <redacted>`;
		}
	}

	return clone;
}
