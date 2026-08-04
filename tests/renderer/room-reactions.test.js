import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRoom } from "@/composables/useRoom.js";
import { FakeAudioEngine } from "@/audio/index.js";
import { FakeRoomEvents } from "@/room/index.js";
import { stubBridge } from "../setup.js";

let bridge;
let events;

function makeRoom() {
	const room = useRoom({
		makeAudio: async () => new FakeAudioEngine(),
		makeEvents: async () => {
			events = new FakeRoomEvents();
			return events;
		}
	});

	Object.defineProperty(room, "_events", { get: () => events });
	return room;
}

function joinWith(extra = {}) {
	bridge.api.joinChannel = vi.fn().mockResolvedValue({
		ok: true,
		data: {
			success: true,
			channel: "C1",
			user_profile_id: 9,
			users: [{ user_id: 9, name: "Me" }, { user_id: 5, name: "Them" }],
			user_capabilities: {},
			emoji_reactions: { channel_reactions: ["❤", "😂", "🔥"] },
			...extra
		}
	});
}

beforeEach(() => {
	vi.useFakeTimers();
	bridge = stubBridge();
	bridge.api.leaveChannel = vi.fn().mockResolvedValue({ ok: true, data: {} });
});

afterEach(() => {
	vi.useRealTimers();
});

describe("emoji over the room", () => {
	it("takes its palette from the room, not from us", async () => {
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		expect(room.reactionOptions.value).toEqual(["❤", "😂", "🔥"]);
	});

	it("shows a reaction arriving over PubNub on that person's tile", async () => {
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		room._events.deliver({ action: "new_channel_reaction", from_user_id: 5, reaction: "🔥" });

		expect(room.reactionFor(5)).toBe("🔥");
		expect(room.reactionFor(9)).toBeNull();
	});

	it("lets a reaction fade after its moment", async () => {
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		room._events.deliver({ action: "new_channel_reaction", from_user_id: 5, reaction: "🔥" });
		await vi.advanceTimersByTimeAsync(4100);

		expect(room.reactionFor(5)).toBeNull();
	});

	it("replaces rather than stacks a burst from one person", async () => {
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		room._events.deliver({ action: "new_channel_reaction", from_user_id: 5, reaction: "❤" });
		room._events.deliver({ action: "new_channel_reaction", from_user_id: 5, reaction: "😂" });

		expect(room.reactionFor(5)).toBe("😂");
	});

	it("sends through the API and shows your own immediately", async () => {
		// The echo over PubNub is neither guaranteed nor instant; a reaction
		// button that does nothing visible feels broken even when it worked.
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		await expect(room.sendReaction("❤")).resolves.toBe(true);

		expect(bridge.api.sendChannelReaction).toHaveBeenCalledWith("C1", "❤");
		expect(room.reactionFor(9)).toBe("❤");
	});

	it("reports a refused reaction instead of pretending", async () => {
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		bridge.api.sendChannelReaction = vi
			.fn()
			.mockResolvedValue({ ok: false, error: { message: "Nope", status: 400 } });

		await expect(room.sendReaction("❤")).resolves.toBe(false);
		expect(room.reactionFor(9)).toBeNull();
		expect(room.chat.error).toBe("Nope");
	});

	it("clears every floating emoji on leaving", async () => {
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		room._events.deliver({ action: "new_channel_reaction", from_user_id: 5, reaction: "🔥" });
		await room.leave();

		expect(room.reactionFor(5)).toBeNull();
		expect(room.reactionOptions.value).toEqual([]);
	});

	it("tolerates payload shapes it has not seen", async () => {
		// The shape is known only from observation, so alternates must not throw.
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		expect(() =>
			room._events.deliver({ action: "new_channel_reaction", user_profile: { user_id: 5 }, emoji: "❤" })
		).not.toThrow();
		expect(room.reactionFor(5)).toBe("❤");

		expect(() => room._events.deliver({ action: "new_channel_reaction" })).not.toThrow();
	});
});
