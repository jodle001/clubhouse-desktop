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
 * Build an E.164 number from a selected country and a locally-written number.
 *
 * The local part is taken as typed - "(555) 123-4567", "555 123 4567" and
 * "5551234567" all work. If the country uses a national trunk prefix, a leading
 * 0 is dropped, since that digit does not appear in the international form.
 *
 * A local part already written internationally (starting with "+", or with the
 * country's own dialling code) is honoured as-is, so pasting a full number does
 * not end up double-prefixed.
 */
export function composePhone(country, local) {
	const raw = String(local || "").trim();

	// Already international - the country selection does not apply.
	if (raw.startsWith("+")) {
		return normalizePhone(raw);
	}

	let digits = raw.replace(/\D/g, "");
	if (!digits) {
		return "";
	}

	if (country && country.trunk) {
		digits = digits.replace(/^0+/, "");
	}

	if (!country) {
		return "+" + digits;
	}

	// Tolerate the country code being typed without a "+" ("15551234567"), but
	// only when what remains is still a plausible subscriber number - otherwise
	// a local number that merely starts with those digits would be mangled.
	if (digits.startsWith(country.dial) && digits.length - country.dial.length >= 6) {
		return "+" + digits;
	}

	return "+" + country.dial + digits;
}

/**
 * Returns a human-readable problem with a normalized number, or null if it
 * looks like something the API will accept.
 */
export function phoneError(normalized, country) {
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

	// Where the national number has a fixed length we can catch a too-short
	// entry here, rather than sending it and getting a generic API rejection.
	// Only applied when the number actually carries this country's dial code.
	if (country && country.nsn && normalized.startsWith("+" + country.dial)) {
		const national = normalized.slice(1 + country.dial.length);
		if (national.length !== country.nsn) {
			return (
				`A ${country.name} number needs ${country.nsn} digits after +${country.dial}, ` +
				`but ${national.length} ${national.length === 1 ? "was" : "were"} entered.`
			);
		}
	}

	return null;
}
