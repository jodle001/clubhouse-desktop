/**
 * Phone number handling for the Clubhouse API.
 *
 * The API expects E.164: a leading "+", then country code, then the number,
 * with no spaces or punctuation. Anything else comes back as
 * "Your phone number is incorrect, please try again".
 *
 * The app used to send whatever was typed, straight through, guarded only by a
 * 4-to-16 character length check. So "(555) 123-4567" passed validation and was
 * rejected by the server with no indication of why.
 */

/**
 * Strip formatting to E.164. Keeps a leading "+" if present, drops every other
 * non-digit: "(555) 123-4567" -> "5551234567", "+1 555-123-4567" -> "+15551234567".
 */
export function normalizePhone(raw) {
	if (!raw) {
		return "";
	}

	const trimmed = String(raw).trim();
	const hasPlus = trimmed.startsWith("+");
	const digits = trimmed.replace(/\D/g, "");

	if (!digits) {
		return "";
	}

	return (hasPlus ? "+" : "") + digits;
}

/**
 * Returns a human-readable problem with a normalized number, or null if it
 * looks like something the API will accept.
 */
export function phoneError(normalized) {
	if (!normalized) {
		return "Enter your phone number.";
	}

	if (!normalized.startsWith("+")) {
		// A leading 0 is national trunk prefix (UK, most of Europe); it is
		// dropped in E.164 rather than having a country code stuck in front.
		if (normalized.startsWith("0")) {
			return (
				"That looks like a national number. Drop the leading 0 and add your " +
				`country code, for example +44${normalized.slice(1)} for the UK.`
			);
		}

		return (
			"Include your country code, starting with +. " +
			`For example +1${normalized} for the US.`
		);
	}

	// E.164 allows at most 15 digits, and country codes never start with 0.
	if (!/^\+[1-9]\d{6,14}$/.test(normalized)) {
		return `${normalized} is not a valid international number.`;
	}

	return null;
}
