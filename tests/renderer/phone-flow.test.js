import { describe, expect, it } from "vitest";
import { composePhone, phoneError, verificationCode } from "@shared/phone.js";
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

	// The real guard, not a re-implementation of it: an earlier version of
	// this file duplicated the rule locally, so it kept passing while the
	// form could regress freely.

	it("accepts the 6 digit code Clubhouse actually sends", () => {
		expect(verificationCode("123456")).toBe("123456");
	});

	it("still accepts 4 digits, which older accounts received", () => {
		expect(verificationCode("1234")).toBe("1234");
	});

	it("strips the formatting people paste", () => {
		expect(verificationCode(" 123 456 ")).toBe("123456");
	});

	it("rejects empty and obviously wrong lengths", () => {
		expect(verificationCode("")).toBe("");
		expect(verificationCode("12")).toBe("");
		expect(verificationCode("1234567890123")).toBe("");
	});
});
