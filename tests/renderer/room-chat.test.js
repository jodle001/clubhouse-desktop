import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRoom } from "@/composables/useRoom.js";
import { FakeAudioEngine } from "@/audio/index.js";
import { FakeRoomEvents } from "@/room/index.js";
import { stubBridge } from "../setup.js";

const ME = 1284234101;

/** join_channel's answer, trimmed to what the chat code reads. */
function joinResult(overrides = {}) {
	return {
		success: true,
		channel: "PAKBKoJ7",
		channel_id: 825090450,
		topic: "God & Philosophy",
		user_profile_id: ME,
		users: [{ user_id: ME, name: "Daily Shadow", username: "dailyshadow" }],
		is_room_chat_available: true,
		is_chat_enabled: true,
		user_capabilities: { can_post_to_chat: true },
		...overrides
	};
}

/**
 * A real new_channel_message, as logged from PubNub. The author is carried
 * inline, which is why no user lookup is needed.
 */
function messageEvent(overrides = {}) {
	return {
		action: "new_channel_message",
		from_user_id: 304618185,
		from_name: "Bill Brown",
		from_username: "bill217",
		from_photo_url: "https://example.invalid/p.png",
		channel: "PAKBKoJ7",
		message_id: "a143d43c-87d7-4800-aa1a-ca141c17ebdf",
		message: "I mean like Jane, Tom, Jack",
		...overrides
	};
}

let bridge;
let events;

function makeRoom() {
	return useRoom({
		makeAudio: async () => new FakeAudioEngine(),
		makeEvents: async () => {
			events = new FakeRoomEvents();
			return events;
		}
	});
}

beforeEach(() => {
	vi.useFakeTimers();
	events = null;
	bridge = stubBridge();
	bridge.api.joinChannel = vi.fn().mockResolvedValue({ ok: true, data: joinResult() });
	bridge.api.leaveChannel = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
	bridge.api.sendChatMessage = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
});

afterEach(() => vi.useRealTimers());

describe("room chat", () => {
	it("shows a message that arrives over PubNub", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		events.deliver(messageEvent());

		expect(room.chat.messages).toHaveLength(1);
		expect(room.chat.messages[0].message).toBe("I mean like Jane, Tom, Jack");
		expect(room.chat.messages[0].user_profile.name).toBe("Bill Brown");
	});

	it("never fetches history, which the API rejects with an empty 400", async () => {
		bridge.api.getChatMessages = vi.fn();

		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });
		await vi.advanceTimersByTimeAsync(60000);

		// It used to poll this every ten seconds, for a 400 every time.
		expect(bridge.api.getChatMessages).not.toHaveBeenCalled();
	});

	it("ignores a message it has already shown", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		events.deliver(messageEvent());
		events.deliver(messageEvent());

		expect(room.chat.messages).toHaveLength(1);
	});

	it("keeps distinct messages from the same person", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		events.deliver(messageEvent({ message_id: "a", message: "one" }));
		events.deliver(messageEvent({ message_id: "b", message: "two" }));

		expect(room.chat.messages.map(m => m.message)).toEqual(["one", "two"]);
	});

	it("sends { channel, message } and shows it straight away", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		await expect(room.sendChat("  hello  ")).resolves.toBe(true);

		expect(bridge.api.sendChatMessage).toHaveBeenCalledWith({
			channel: "PAKBKoJ7",
			message: "hello"
		});
		expect(room.chat.messages).toHaveLength(1);
		expect(room.chat.messages[0].message).toBe("hello");
	});

	it("does not show your own message twice when it echoes back", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		await room.sendChat("hello");
		events.deliver(messageEvent({ from_user_id: ME, from_name: "Daily Shadow", message: "hello", message_id: "srv-1" }));

		expect(room.chat.messages).toHaveLength(1);
		expect(room.chat.messages[0].message_id).toBe("srv-1");
		expect(room.chat.messages[0].pending).toBeUndefined();
	});

	it("refuses to send an empty message", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		await expect(room.sendChat("   ")).resolves.toBe(false);
		expect(bridge.api.sendChatMessage).not.toHaveBeenCalled();
	});

	it("reports a failed send rather than pretending it worked", async () => {
		// RoomView only clears the input on true, so this is what stops a
		// failed message vanishing from the box.
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		bridge.api.sendChatMessage = vi
			.fn()
			.mockResolvedValue({ ok: false, error: { message: "Channel is required.", status: 400 } });

		await expect(room.sendChat("hello")).resolves.toBe(false);
		expect(room.chat.error).toBe("Channel is required.");
		expect(room.chat.messages).toHaveLength(0);
	});

	it("follows the server on availability and permission", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		expect(room.chat.enabled).toBe(true);
		expect(room.chat.canPost).toBe(true);
	});

	it("stays hidden in a room with chat turned off", async () => {
		bridge.api.joinChannel = vi
			.fn()
			.mockResolvedValue({ ok: true, data: joinResult({ is_room_chat_available: false }) });

		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		expect(room.chat.enabled).toBe(false);
	});

	it("hides the composer when the room forbids posting", async () => {
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: joinResult({ user_capabilities: { can_post_to_chat: false } })
		});

		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		expect(room.chat.enabled).toBe(true);
		expect(room.chat.canPost).toBe(false);
	});

	it("caps the backlog so a long room cannot grow without bound", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		for (let i = 0; i < 260; i++) {
			events.deliver(messageEvent({ message_id: `m${i}`, message: `line ${i}` }));
		}

		expect(room.chat.messages).toHaveLength(200);
		// The oldest are dropped, not the newest.
		expect(room.chat.messages.at(-1).message).toBe("line 259");
	});

	it("forgets the conversation on leaving", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });
		events.deliver(messageEvent());

		await room.leave();

		expect(room.chat.messages).toEqual([]);
		expect(room.chat.enabled).toBe(false);
	});
});
