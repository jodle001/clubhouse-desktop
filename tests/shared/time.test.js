import { describe, expect, it } from "vitest";
import { relativeTime } from "@shared/time.js";

const NOW = Date.parse("2026-08-05T12:00:00Z");
const ago = (n, unit) => {
	const s = { s: 1, m: 60, h: 3600, d: 86400, w: 604800, mo: 2592000, y: 31536000 }[unit];
	return new Date(NOW - n * s * 1000).toISOString();
};

describe("relativeTime", () => {
	it("says just now under a minute", () => {
		expect(relativeTime(ago(30, "s"), NOW)).toBe("just now");
	});

	it("counts minutes, hours, days", () => {
		expect(relativeTime(ago(5, "m"), NOW)).toBe("5m");
		expect(relativeTime(ago(3, "h"), NOW)).toBe("3h");
		expect(relativeTime(ago(2, "d"), NOW)).toBe("2d");
	});

	it("rolls up to weeks, months, years", () => {
		expect(relativeTime(ago(2, "w"), NOW)).toBe("2w");
		expect(relativeTime(ago(3, "mo"), NOW)).toBe("3mo");
		expect(relativeTime(ago(2, "y"), NOW)).toBe("2y");
	});

	it("never goes negative for a stamp slightly in the future", () => {
		expect(relativeTime(new Date(NOW + 5000).toISOString(), NOW)).toBe("just now");
	});

	it("returns empty for a stamp it cannot parse", () => {
		expect(relativeTime("not a date", NOW)).toBe("");
		expect(relativeTime(undefined, NOW)).toBe("");
	});
});
