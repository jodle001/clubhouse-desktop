import { describe, expect, it } from "vitest";
import COUNTRIES, { DEFAULT_COUNTRY, findCountry } from "@shared/countries.js";

describe("countries", () => {
	it("has no duplicate ISO codes", () => {
		const seen = new Set();
		const dupes = COUNTRIES.filter(c => (seen.has(c.iso) ? true : (seen.add(c.iso), false)));
		expect(dupes).toEqual([]);
	});

	it("gives every entry a name and a numeric dial code", () => {
		for (const c of COUNTRIES) {
			expect(c.name, JSON.stringify(c)).toBeTruthy();
			expect(c.dial, JSON.stringify(c)).toMatch(/^[1-9]\d{0,3}$/);
			expect(c.iso, JSON.stringify(c)).toMatch(/^[A-Z]{2}$/);
		}
	});

	it("is sorted by name so the dropdown is scannable", () => {
		const names = COUNTRIES.map(c => c.name);
		expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
	});

	it("marks every NANP member with a 10 digit national number", () => {
		for (const c of COUNTRIES.filter(c => c.dial === "1")) {
			expect(c.nsn, c.name).toBe(10);
		}
	});

	it("does not mark Italy as using a trunk prefix", () => {
		expect(findCountry("IT").trunk).toBeUndefined();
	});

	it("falls back to the default for an unknown code", () => {
		expect(findCountry("ZZ").iso).toBe(DEFAULT_COUNTRY);
	});
});
