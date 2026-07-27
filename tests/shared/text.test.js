import { describe, expect, it } from "vitest";
import { isLatin } from "@shared/text.js";

describe("isLatin", () => {
	it("treats empty input as Latin", () => {
		expect(isLatin("")).toBe(true);
		expect(isLatin(null)).toBe(true);
	});

	it("accepts Latin topics", () => {
		expect(isLatin("Morning coffee chat")).toBe(true);
	});

	it("rejects CJK and kana", () => {
		expect(isLatin("朝のコーヒー")).toBe(false);
		expect(isLatin("한국어")).toBe(true); // Hangul is deliberately not filtered
		expect(isLatin("中文房间")).toBe(false);
	});
});
