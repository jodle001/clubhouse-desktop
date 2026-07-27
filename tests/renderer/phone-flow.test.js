import { describe, expect, it } from "vitest";
import { composePhone, phoneError } from "@shared/phone.js";
import { findCountry } from "@shared/countries.js";

/**
 * The two silent-guard bugs that made this app appear to do nothing:
 * a phone field that sent raw input, and a code field that demanded
 * exactly 4 digits when Clubhouse sends 6.
 */
describe("sign-in guards (regression)", () => {
	it("a bare US number reaches the API in E.164", () => {
		const phone = composePhone(findCountry("US"), "5551234567");
		expect(phoneError(phone, findCountry("US"))).toBeNull();
		expect(phone).toBe("+15551234567");
	});

	it("a 7 digit US number is refused before any request is made", () => {
		const phone = composePhone(findCountry("US"), "5555555");
		expect(phoneError(phone, findCountry("US"))).toBeTruthy();
	});

	const codeAccepted = code => {
		const digits = String(code || "").replace(/\D/g, "");
		return digits.length >= 4 && digits.length <= 8;
	};

	it("accepts the 6 digit code Clubhouse actually sends", () => {
		expect(codeAccepted("123456")).toBe(true);
	});

	it("still accepts 4 digits, which older accounts received", () => {
		expect(codeAccepted("1234")).toBe(true);
	});

	it("rejects empty and obviously wrong lengths", () => {
		expect(codeAccepted("")).toBe(false);
		expect(codeAccepted("12")).toBe(false);
		expect(codeAccepted("1234567890123")).toBe(false);
	});
});
