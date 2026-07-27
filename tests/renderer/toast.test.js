import { beforeEach, describe, expect, it } from "vitest";
import { dismiss, notify, useToast } from "@/composables/useToast.js";

const { toasts } = useToast();

beforeEach(() => {
	toasts.items.splice(0, toasts.items.length);
});

describe("useToast", () => {
	it("counts a repeated message instead of stacking it", () => {
		// A failing call on a 30-second poll produced a fresh toast every cycle.
		notify({ type: "error", message: "Not found", timeout: 0 });
		notify({ type: "error", message: "Not found", timeout: 0 });
		notify({ type: "error", message: "Not found", timeout: 0 });

		expect(toasts.items).toHaveLength(1);
		expect(toasts.items[0].repeats).toBe(3);
	});

	it("keeps distinct messages apart", () => {
		notify({ type: "error", message: "One", timeout: 0 });
		notify({ type: "error", message: "Two", timeout: 0 });

		expect(toasts.items.map(item => item.message)).toEqual(["One", "Two"]);
	});

	it("treats the same text at a different level as its own toast", () => {
		notify({ type: "error", message: "Same", timeout: 0 });
		notify({ type: "info", message: "Same", timeout: 0 });

		expect(toasts.items).toHaveLength(2);
	});

	it("returns the existing id when it merges, so dismiss still works", () => {
		const first = notify({ type: "error", message: "Merged", timeout: 0 });
		const second = notify({ type: "error", message: "Merged", timeout: 0 });

		expect(second).toBe(first);
		dismiss(second);
		expect(toasts.items).toHaveLength(0);
	});
});
