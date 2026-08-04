import { describe, expect, it } from "vitest";
import { composePhone, normalizePhone, phoneError } from "@shared/phone.js";
import { findCountry } from "@shared/countries.js";

const US = findCountry("US");
const GB = findCountry("GB");
const IT = findCountry("IT");

describe("normalizePhone", () => {
	it("strips punctuation but keeps a leading +", () => {
		expect(normalizePhone("+1 (555) 123-4567")).toBe("+15551234567");
	});

	it("drops a + that is not leading", () => {
		expect(normalizePhone("555+123")).toBe("555123");
	});

	it("returns empty for junk", () => {
		expect(normalizePhone("abc")).toBe("");
		expect(normalizePhone("")).toBe("");
		expect(normalizePhone(null)).toBe("");
	});
});

describe("composePhone", () => {
	it("prefixes the country dial code for a bare national number", () => {
		expect(composePhone(US, "5551234567")).toBe("+15551234567");
	});

	it("accepts the ways people actually type numbers", () => {
		for (const input of ["(555) 123-4567", "555-123-4567", "555 123 4567", " 5551234567 "]) {
			expect(composePhone(US, input)).toBe("+15551234567");
		}
	});

	it("honours an already-international number and does not double-prefix", () => {
		expect(composePhone(US, "+447911123456")).toBe("+447911123456");
		expect(composePhone(US, "15551234567")).toBe("+15551234567");
	});

	it("drops the trunk 0 for countries that use one", () => {
		expect(composePhone(GB, "07911 123456")).toBe("+447911123456");
	});

	it("keeps the leading 0 for Italy, which is the exception", () => {
		expect(composePhone(IT, "06 1234 5678")).toBe("+390612345678");
	});

	it("strips Russia's trunk 8, not a zero it does not use", () => {
		// The universal national form is 8 916 ... - stripping only zeros
		// composed +789..., a wrong number with no hint why.
		expect(composePhone(findCountry("RU"), "8 916 123-45-67")).toBe("+79161234567");
	});

	it("strips Hungary's two-digit 06", () => {
		expect(composePhone(findCountry("HU"), "06 30 123 4567")).toBe("+36301234567");
	});

	it("leaves a Russian number that never had the 8", () => {
		expect(composePhone(findCountry("RU"), "916 123 45 67")).toBe("+79161234567");
	});

	it("returns empty when there is nothing to compose", () => {
		expect(composePhone(US, "")).toBe("");
	});
});

describe("phoneError", () => {
	it("accepts a well-formed number", () => {
		expect(phoneError("+15551234567", US)).toBeNull();
	});

	it("rejects a US number with the wrong digit count", () => {
		// The literal case that motivated this: 7 digits, silently accepted before.
		expect(phoneError(composePhone(US, "5555555"), US)).toMatch(/10 digits/);
	});

	it("explains a missing country code", () => {
		expect(phoneError("5551234567")).toMatch(/country code/i);
	});

	it("tells trunk-prefixed numbers to drop the 0", () => {
		expect(phoneError("07911123456")).toMatch(/leading 0/i);
	});

	it("rejects empty and too-short input", () => {
		expect(phoneError("")).toMatch(/Enter your phone number/);
		expect(phoneError("+1")).toMatch(/not a valid/);
	});
});
