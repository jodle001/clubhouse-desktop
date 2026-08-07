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
			// Both forms, as the real response carries them: bare emoji, and
			// the id-bearing objects /send_channel_reaction actually wants.
			emoji_reactions: { channel_reactions: ["❤", "😂", "🔥"] },
			reactions: {
				channel_reactions: [
					{ reaction_id: 101, emoji: "❤" },
					{ reaction_id: 102, emoji: "😂" },
					{ reaction_id: 103, emoji: "🔥" }
				]
			},
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
	it("takes its palette from the room, with the ids the sender needs", async () => {
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		expect(room.reactionOptions.value).toEqual([
			{ id: 101, emoji: "❤" },
			{ id: 102, emoji: "😂" },
			{ id: 103, emoji: "🔥" }
		]);
	});

	it("falls back to bare emoji when the room sends no id objects", async () => {
		joinWith({ reactions: undefined });
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		expect(room.reactionOptions.value).toEqual([
			{ id: null, emoji: "❤" },
			{ id: null, emoji: "😂" },
			{ id: null, emoji: "🔥" }
		]);
	});

	it("shows a reaction arriving over PubNub on that person's tile", async () => {
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		room._events.deliver({ action: "new_channel_reaction", from_user_id: 5, reaction: "🔥" });

		expect(room.reactionFor(5)?.emoji).toBe("🔥");
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

		expect(room.reactionFor(5)?.emoji).toBe("😂");
	});

	it("sends id and target - yourself by default - and shows it at once", async () => {
		// The server named its fields one 400 at a time: "Reaction id is
		// required.", then "Target user id is required." A plain reaction
		// targets your own tile, which is where the phone app draws it. The
		// PubNub echo is neither guaranteed nor instant; a button that does
		// nothing visible feels broken even when it worked.
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		await expect(room.sendReaction(room.reactionOptions.value[0])).resolves.toBe(true);

		expect(bridge.api.sendChannelReaction).toHaveBeenCalledWith("C1", 101, 9);
		expect(room.reactionFor(9)?.emoji).toBe("❤");
	});

	it("can aim a reaction at somebody else's tile", async () => {
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		await room.sendReaction(room.reactionOptions.value[2], 5);

		expect(bridge.api.sendChannelReaction).toHaveBeenCalledWith("C1", 103, 5);
		expect(room.reactionFor(5)?.emoji).toBe("🔥");
		expect(room.reactionFor(9)).toBeNull();
	});

	it("draws an incoming reaction on its target, not its sender", async () => {
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		room._events.deliver({
			action: "new_channel_reaction",
			from_user_id: 5,
			target_user_id: 9,
			reaction: "👏"
		});

		expect(room.reactionFor(9)?.emoji).toBe("👏");
		expect(room.reactionFor(5)).toBeNull();
	});

	it("reads the live shape: reaction as an object, aimed at target_user_profile", async () => {
		// Verbatim (trimmed) from a logged event: `reaction` is an object
		// carrying the emoji and its display time, the reactor is
		// action_user_profile and the target is target_user_profile. Reading
		// `event.reaction` as the emoji drew "[object Object]" on the
		// reactor's tile.
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		room._events.deliver({
			action: "new_channel_reaction",
			channel: "C1",
			action_user_profile: { id: 5, name: "Them" },
			target_user_profile: { id: 9, name: "Me" },
			reaction: { id: 47, title: null, is_paid: false, emoji: "🙄", coins_price: 0, display_time_s: 4 }
		});

		expect(room.reactionFor(9)?.emoji).toBe("🙄");
		expect(room.reactionFor(5)).toBeNull();
	});

	it("keeps a reaction up for as long as its event asks", async () => {
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		room._events.deliver({
			action: "new_channel_reaction",
			action_user_profile: { id: 5 },
			reaction: { id: 1, emoji: "🎉", display_time_s: 10 }
		});

		await vi.advanceTimersByTimeAsync(4100);
		expect(room.reactionFor(5)?.emoji).toBe("🎉");

		await vi.advanceTimersByTimeAsync(6000);
		expect(room.reactionFor(5)).toBeNull();
	});

	it("draws a giphy reaction from its id, for its own display time", async () => {
		// {action:"gif_reaction", user_id, giphy_id, display_time_s} was
		// arriving and being logged as unhandled - dropped on the floor.
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		room._events.deliver({
			action: "gif_reaction",
			channel: "C1",
			user_id: 5,
			giphy_id: "cEb1tO6Xvn0DS",
			display_time_s: 30
		});

		expect(room.reactionFor(5)?.gif).toBe("https://media.giphy.com/media/cEb1tO6Xvn0DS/200w.gif");
		expect(room.reactionFor(5)?.emoji).toBeNull();

		await vi.advanceTimersByTimeAsync(29000);
		expect(room.reactionFor(5)?.gif).toBeTruthy();

		await vi.advanceTimersByTimeAsync(1100);
		expect(room.reactionFor(5)).toBeNull();
	});

	it("ignores a gif event with no id rather than drawing a broken image", async () => {
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		expect(() => room._events.deliver({ action: "gif_reaction", user_id: 5 })).not.toThrow();
		expect(room.reactionFor(5)).toBeNull();
	});

	it("falls back to the emoji when no id is known", async () => {
		// A wrong guess then draws a server error that names the field,
		// which beats a button that silently cannot send.
		joinWith({ reactions: undefined });
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		await room.sendReaction(room.reactionOptions.value[0]);
		expect(bridge.api.sendChannelReaction).toHaveBeenCalledWith("C1", "❤", 9);
	});

	it("reports a refused reaction instead of pretending", async () => {
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		bridge.api.sendChannelReaction = vi
			.fn()
			.mockResolvedValue({ ok: false, error: { message: "Nope", status: 400 } });

		await expect(room.sendReaction(room.reactionOptions.value[0])).resolves.toBe(false);
		expect(room.reactionFor(9)).toBeNull();
		// A reaction failure is its own error, not chat's - writing it to
		// chat.error hid every chat message until a rejoin.
		expect(room.reactionError.value).toBe("Nope");
		expect(room.chat.error).toBe("");
	});

	it("retires the picker when the server refuses on its feature flag", async () => {
		// "Feature flag is not enabled" follows the claimed client identity,
		// not the payload - the same account reacts fine from the phone. No
		// press will succeed under this identity, so the button stops offering.
		joinWith();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		bridge.api.sendChannelReaction = vi
			.fn()
			.mockResolvedValue({ ok: false, error: { message: "Feature flag is not enabled", status: 400 } });

		await room.sendReaction(room.reactionOptions.value[0]);

		expect(room.reactionsBlocked.value).toBe(true);
		expect(room.reactionError.value).toMatch(/won't accept reactions from this desktop client/i);
		expect(room.chat.error).toBe("");
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
		expect(room.reactionFor(5)?.emoji).toBe("❤");

		expect(() => room._events.deliver({ action: "new_channel_reaction" })).not.toThrow();
	});
});
