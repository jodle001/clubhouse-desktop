import { describe, expect, it, vi } from "vitest";
import {
	ACTIONS,
	channelsFor,
	createRoomEvents,
	FakeRoomEvents,
	NullRoomEvents,
	PubNubRoomEvents
} from "@/room/index.js";

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

	it("does not cross wires between actions", () => {
		const events = new FakeRoomEvents();
		let called = false;
		events.on("join_channel", () => (called = true));
		events.deliver({ action: "something_new", user_id: 1 });
		expect(called).toBe(false);
	});

	it("delivers actions it has never heard of", () => {
		// The old allowlist dropped anything the 2021 client did not know,
		// which is why live chat could not be found. Unknown actions are
		// emitted now, and logged by the PubNub adapter.
		const events = new FakeRoomEvents();
		const seen = [];
		events.on("channel_message", m => seen.push(m.text));

		events.deliver({ action: "channel_message", text: "hello" });
		expect(seen).toEqual(["hello"]);
	});

	it("ignores a message with no action at all", () => {
		const events = new FakeRoomEvents();
		expect(() => events.deliver({})).not.toThrow();
		expect(() => events.deliver(null)).not.toThrow();
	});
});

describe("the real PubNub adapter's dispatch", () => {
	// _dispatch is what the network listener calls; testing it on the real
	// class means reintroducing an allowlist here would fail tests, instead
	// of only failing the Fake that documents the contract.
	const make = () => {
		const log = vi.fn();
		return { events: new PubNubRoomEvents({ userId: 9, log }), log };
	};

	it("emits actions it has never heard of", () => {
		const { events } = make();
		const seen = [];
		events.on("brand_new_action", m => seen.push(m.value));

		events._dispatch({ action: "brand_new_action", value: 42 });
		expect(seen).toEqual([42]);
	});

	it("logs only what nothing is listening for", () => {
		const { events, log } = make();
		events.on("handled", () => {});

		events._dispatch({ action: "handled" });
		expect(log).not.toHaveBeenCalled();

		events._dispatch({ action: "unhandled_thing" });
		expect(log).toHaveBeenCalledOnce();
		expect(log.mock.calls[0][0]).toContain("unhandled_thing");
	});

	it("ignores messages with no action", () => {
		const { events, log } = make();
		expect(() => events._dispatch(null)).not.toThrow();
		expect(() => events._dispatch({})).not.toThrow();
		expect(log).not.toHaveBeenCalled();
	});
});

describe("the channel names a room rides on", () => {
	// Wrong strings here kill every live update silently - the exact failure
	// class this codebase kept shipping.
	it("subscribes to the room, your user channel, and your inbox", () => {
		expect(channelsFor({ channel: "abc" }, 9)).toEqual([
			"channel_all.abc",
			"channel_user.abc.9",
			"users.9"
		]);
	});

	it("adds the speakers channel for a moderator", () => {
		expect(channelsFor({ channel: "abc", is_moderator: true }, 9)).toContain("channel_speakers.abc");
	});

	it("does not give a listener the moderator channel", () => {
		expect(channelsFor({ channel: "abc", is_moderator: false }, 9)).toHaveLength(3);
	});
});
