import { describe, expect, it } from "vitest";
import { ACTIONS, createRoomEvents, FakeRoomEvents, NullRoomEvents } from "@/room/index.js";

describe("room events port", () => {
	it("falls back to null without keys", async () => {
		const events = await createRoomEvents({ enabled: true });
		expect(events.name).toBe("null");
	});

	it("returns null when disabled", async () => {
		const events = await createRoomEvents({ enabled: false, publishKey: "p", subscribeKey: "s" });
		expect(events.name).toBe("null");
	});

	it("subscribing without a backend is a no-op, not a crash", async () => {
		await expect(new NullRoomEvents().subscribe({ channel: "x" })).resolves.toBeUndefined();
	});

	it("delivers known actions to handlers", () => {
		const events = new FakeRoomEvents();
		const seen = [];
		for (const action of ACTIONS) {
			events.on(action, m => seen.push([action, m.user_id]));
		}

		events.deliver({ action: "join_channel", user_id: 1 });
		events.deliver({ action: "raise_hands", user_id: 2 });
		expect(seen).toEqual([["join_channel", 1], ["raise_hands", 2]]);
	});

	it("ignores unknown actions", () => {
		const events = new FakeRoomEvents();
		let called = false;
		events.on("join_channel", () => (called = true));
		events.deliver({ action: "something_new", user_id: 1 });
		expect(called).toBe(false);
	});
});
