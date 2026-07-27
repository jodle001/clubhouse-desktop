import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRoom } from "@/composables/useRoom.js";
import { FakeAudioEngine } from "@/audio/index.js";
import { FakeRoomEvents } from "@/room/index.js";
import { stubBridge } from "../setup.js";

/** join_channel's answer, trimmed to what the chat code reads. */
function joinResult(overrides = {}) {
	return {
		success: true,
		channel: "PAKBKoJ7",
		channel_id: 825090450,
		topic: "God & Philosophy",
		users: [],
		is_room_chat_available: true,
		is_chat_enabled: true,
		user_capabilities: { can_post_to_chat: true },
		...overrides
	};
}

function makeRoom() {
	return useRoom({
		makeAudio: async () => new FakeAudioEngine(),
		makeEvents: async () => new FakeRoomEvents()
	});
}

let bridge;

beforeEach(() => {
	vi.useFakeTimers();
	bridge = stubBridge();
	bridge.api.joinChannel = vi.fn().mockResolvedValue({ ok: true, data: joinResult() });
	bridge.api.leaveChannel = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
	bridge.api.getChatMessages = vi.fn().mockResolvedValue({ ok: true, data: { messages: [] } });
	bridge.api.sendChatMessage = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
});

afterEach(() => vi.useRealTimers());

describe("room chat", () => {
	it("asks for history with both identifiers", async () => {
		// `channel` alone got a 400 from the live API, so channel_id goes too.
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: 1 });

		expect(bridge.api.getChatMessages).toHaveBeenCalledWith({
			channel: "PAKBKoJ7",
			channelId: 825090450
		});
	});

	it("follows the server on whether chat is available and postable", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: 1 });

		expect(room.chat.enabled).toBe(true);
		expect(room.chat.canPost).toBe(true);
	});

	it("stays quiet in a room with chat turned off", async () => {
		bridge.api.joinChannel = vi
			.fn()
			.mockResolvedValue({ ok: true, data: joinResult({ is_room_chat_available: false }) });

		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: 1 });

		expect(room.chat.enabled).toBe(false);
		expect(bridge.api.getChatMessages).not.toHaveBeenCalled();
	});

	it("hides the composer when the room forbids posting", async () => {
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: joinResult({ user_capabilities: { can_post_to_chat: false } })
		});

		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: 1 });

		expect(room.chat.enabled).toBe(true);
		expect(room.chat.canPost).toBe(false);
	});

	it("sends { channel, message }, the fields the API named", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: 1 });

		await expect(room.sendChat("  hello  ")).resolves.toBe(true);
		expect(bridge.api.sendChatMessage).toHaveBeenCalledWith({
			channel: "PAKBKoJ7",
			message: "hello"
		});
	});

	it("refuses to send an empty message", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: 1 });

		await expect(room.sendChat("   ")).resolves.toBe(false);
		expect(bridge.api.sendChatMessage).not.toHaveBeenCalled();
	});

	it("reports a failed send rather than pretending it worked", async () => {
		// RoomView only clears the input on true, so this is what stops a
		// failed message vanishing from the box.
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: 1 });

		bridge.api.sendChatMessage = vi
			.fn()
			.mockResolvedValue({ ok: false, error: { message: "Channel is required.", status: 400 } });

		await expect(room.sendChat("hello")).resolves.toBe(false);
		expect(room.chat.error).toBe("Channel is required.");
	});

	it("accepts whichever key the list comes back under", async () => {
		bridge.api.getChatMessages = vi
			.fn()
			.mockResolvedValue({ ok: true, data: { items: [{ message_id: 1, message: "hi" }] } });

		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: 1 });

		expect(room.chat.messages).toHaveLength(1);
	});

	it("keeps a history failure out of the toast stream", async () => {
		bridge.api.getChatMessages = vi
			.fn()
			.mockResolvedValue({ ok: false, error: { message: "Bad request", status: 400 } });

		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: 1 });

		expect(room.chat.error).toBe("Bad request");
		expect(room.chat.messages).toEqual([]);
	});

	it("stops polling and forgets the messages on leaving", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: 1 });

		const before = bridge.api.getChatMessages.mock.calls.length;
		await room.leave();
		await vi.advanceTimersByTimeAsync(30000);

		expect(bridge.api.getChatMessages.mock.calls.length).toBe(before);
		expect(room.chat.messages).toEqual([]);
		expect(room.chat.enabled).toBe(false);
	});

	it("polls for new messages while in the room", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: 1 });

		const before = bridge.api.getChatMessages.mock.calls.length;
		await vi.advanceTimersByTimeAsync(10000);

		expect(bridge.api.getChatMessages.mock.calls.length).toBeGreaterThan(before);
	});
});
