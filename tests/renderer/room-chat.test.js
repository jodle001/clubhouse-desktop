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
	bridge.api.getChannelMessages = vi.fn().mockResolvedValue({ ok: true, data: { messages: [] } });
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

	it("asks for history once on joining, not on a poll", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		expect(bridge.api.getChannelMessages).toHaveBeenCalledWith({ channel: "PAKBKoJ7" });

		await vi.advanceTimersByTimeAsync(60000);
		expect(bridge.api.getChannelMessages).toHaveBeenCalledTimes(1);
	});

	it("reads a history entry that nests its author, as REST is likely to", async () => {
		bridge.api.getChannelMessages = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				messages: [
					{
						message_id: "h1",
						message: "said earlier",
						time_created: "2026-07-27T10:00:00Z",
						user_profile: { user_id: 5, name: "Someone", username: "someone" }
					}
				]
			}
		});

		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		expect(room.chat.messages).toHaveLength(1);
		expect(room.chat.messages[0].message).toBe("said earlier");
		expect(room.chat.messages[0].user_profile.name).toBe("Someone");
	});

	it("puts history oldest first, whichever order it arrives in", async () => {
		bridge.api.getChannelMessages = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				messages: [
					{ message_id: "b", message: "later", time_created: "2026-07-27T12:00:00Z" },
					{ message_id: "a", message: "earlier", time_created: "2026-07-27T10:00:00Z" }
				]
			}
		});

		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		expect(room.chat.messages.map(m => m.message)).toEqual(["earlier", "later"]);
	});

	it("does not repeat a message that history and PubNub both carry", async () => {
		bridge.api.getChannelMessages = vi.fn().mockResolvedValue({
			ok: true,
			data: { messages: [{ message_id: "dup", message: "hello", time_created: "2026-07-27T10:00:00Z" }] }
		});

		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });
		events.deliver(messageEvent({ message_id: "dup", message: "hello" }));

		expect(room.chat.messages).toHaveLength(1);
	});

	it("stays usable when history fails, since live messages do not need it", async () => {
		bridge.api.getChannelMessages = vi
			.fn()
			.mockResolvedValue({ ok: false, error: { message: "Channel is required.", status: 400 } });

		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		expect(room.chat.error).toBe("Channel is required.");

		events.deliver(messageEvent());
		expect(room.chat.messages).toHaveLength(1);
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

	it("does not show your own message twice when the echo arrives after", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		await room.sendChat("hello");
		events.deliver(messageEvent({ from_user_id: ME, from_name: "Daily Shadow", message: "hello", message_id: "srv-1" }));

		expect(room.chat.messages).toHaveLength(1);
		expect(room.chat.messages[0].message_id).toBe("srv-1");
		expect(room.chat.messages[0].pending).toBe(false);
	});

	it("does not show it twice when the echo arrives first either", async () => {
		// PubNub often publishes before the send request resolves, so this is
		// the ordering that actually happens - and the one that used to double
		// every message.
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		bridge.api.sendChatMessage = vi.fn(() => {
			events.deliver(
				messageEvent({ from_user_id: ME, from_name: "Daily Shadow", message: "hello", message_id: "srv-2" })
			);
			return Promise.resolve({ ok: true, data: { success: true } });
		});

		await room.sendChat("hello");

		expect(room.chat.messages).toHaveLength(1);
		expect(room.chat.messages[0].message_id).toBe("srv-2");
	});

	it("still shows the same words said again later", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		events.deliver(messageEvent({ from_user_id: ME, message: "ok", message_id: "a" }));
		vi.setSystemTime(Date.now() + 60000);
		await room.sendChat("ok");

		expect(room.chat.messages).toHaveLength(2);
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

describe("room counters", () => {
	it("tracks how many have passed through the room", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		events.deliver({ action: "cumulative_count_update", num_ever: 219, channel: "PAKBKoJ7" });
		expect(room.everCount.value).toBe(219);

		events.deliver({ action: "cumulative_count_update", num_ever: 220, channel: "PAKBKoJ7" });
		expect(room.everCount.value).toBe(220);
	});

	it("keeps the last count when an update omits it", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		events.deliver({ action: "cumulative_count_update", num_ever: 5, channel: "PAKBKoJ7" });
		events.deliver({ action: "cumulative_count_update", channel: "PAKBKoJ7" });

		expect(room.everCount.value).toBe(5);
	});

	it("resets on leaving", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });
		events.deliver({ action: "cumulative_count_update", num_ever: 42, channel: "PAKBKoJ7" });

		await room.leave();
		expect(room.everCount.value).toBe(0);
	});
});

describe("unrecognised actions", () => {
	it("logs only what nothing is listening for", () => {
		// Reported on whether a handler exists, not against a list, so handling
		// an action stops the noise with nothing else to update.
		const events = new FakeRoomEvents();
		expect(events.hasHandlers("brand_new_thing")).toBe(false);

		events.on("brand_new_thing", () => {});
		expect(events.hasHandlers("brand_new_thing")).toBe(true);
	});
});

describe("chat message likes", () => {
	it("shows the like count history reports", async () => {
		bridge.api.getChannelMessages = vi.fn().mockResolvedValue({
			ok: true,
			data: { messages: [{ message_id: "m1", message: "hi", like_count: 3 }] }
		});

		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		expect(room.chat.messages[0].like_count).toBe(3);
	});

	it("updates a count when PubNub says it changed", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });
		events.deliver(messageEvent({ message_id: "m1", message: "hi" }));

		events.deliver({
			action: "channel_message_like_count_update",
			channel: "PAKBKoJ7",
			message_id: "m1",
			like_count: 7
		});

		expect(room.chat.messages[0].like_count).toBe(7);
	});

	it("ignores a count for a message it has never seen", async () => {
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		expect(() =>
			events.deliver({
				action: "channel_message_like_count_update",
				message_id: "unknown",
				like_count: 2
			})
		).not.toThrow();
	});
});

describe("liking a message yourself", () => {
	function withHistory(rows) {
		bridge.api.getChannelMessages = vi.fn().mockResolvedValue({
			ok: true,
			data: { messages: rows }
		});
	}

	it("lights up at once, then tells the server", async () => {
		withHistory([{ message_id: "m1", message: "hi", like_count: 2, viewer_has_liked: false }]);
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		const message = room.chat.messages[0];
		await expect(room.toggleMessageLike(message)).resolves.toBe(true);

		expect(message.viewer_has_liked).toBe(true);
		expect(message.like_count).toBe(3);
		expect(bridge.api.likeChatMessage).toHaveBeenCalledWith("PAKBKoJ7", "m1");
	});

	it("unlikes what was already liked", async () => {
		withHistory([{ message_id: "m1", message: "hi", like_count: 2, viewer_has_liked: true }]);
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		const message = room.chat.messages[0];
		await room.toggleMessageLike(message);

		expect(message.viewer_has_liked).toBe(false);
		expect(message.like_count).toBe(1);
		expect(bridge.api.unlikeChatMessage).toHaveBeenCalledWith("PAKBKoJ7", "m1");
	});

	it("puts the heart back when the server refuses", async () => {
		withHistory([{ message_id: "m1", message: "hi", like_count: 0, viewer_has_liked: false }]);
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		bridge.api.likeChatMessage = vi
			.fn()
			.mockResolvedValue({ ok: false, error: { message: "Nope", status: 400 } });

		const message = room.chat.messages[0];
		await expect(room.toggleMessageLike(message)).resolves.toBe(false);

		expect(message.viewer_has_liked).toBe(false);
		expect(message.like_count).toBe(0);
	});

	it("cannot like a pending message that has no id yet", async () => {
		withHistory([]);
		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		await expect(room.toggleMessageLike({ message: "unsent" })).resolves.toBe(false);
		expect(bridge.api.likeChatMessage).not.toHaveBeenCalled();
	});
});

describe("paging into the past", () => {
	const row = (id, time, text) => ({
		message_id: id,
		message: text,
		time_created: time,
		like_count: 0
	});

	it("prepends older messages and keeps reading order", async () => {
		bridge.api.getChannelMessages = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				messages: [row("m3", "2026-08-04T15:03:00-07:00", "newest")],
				next_cursor: "CUR1",
				num_messages: 3
			}
		});

		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });
		expect(room.chat.nextCursor).toBe("CUR1");
		expect(room.chat.total).toBe(3);

		bridge.api.getChannelMessages = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				messages: [
					row("m2", "2026-08-04T15:02:00-07:00", "middle"),
					row("m1", "2026-08-04T15:01:00-07:00", "oldest")
				],
				next_cursor: "CUR2"
			}
		});

		await expect(room.loadOlder()).resolves.toBe(true);

		expect(bridge.api.getChannelMessages).toHaveBeenCalledWith({ channel: "PAKBKoJ7", cursor: "CUR1" });
		expect(room.chat.messages.map(m => m.message)).toEqual(["oldest", "middle", "newest"]);
		expect(room.chat.nextCursor).toBe("CUR2");
	});

	it("stops when a page brings nothing new", async () => {
		// A cursor that repeats its page would otherwise loop forever.
		bridge.api.getChannelMessages = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				messages: [row("m1", "2026-08-04T15:01:00-07:00", "only")],
				next_cursor: "CUR1"
			}
		});

		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });

		await expect(room.loadOlder()).resolves.toBe(false);
		expect(room.chat.nextCursor).toBeNull();
	});

	it("does nothing without a cursor", async () => {
		bridge.api.getChannelMessages = vi.fn().mockResolvedValue({
			ok: true,
			data: { messages: [] }
		});

		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });
		bridge.api.getChannelMessages.mockClear();

		await expect(room.loadOlder()).resolves.toBe(false);
		expect(bridge.api.getChannelMessages).not.toHaveBeenCalled();
	});

	it("old pages are exempt from the newest-200 cap", async () => {
		// The cap protects against a long room's live growth; eating the page
		// that was just fetched would make scrolling up a no-op.
		const live = Array.from({ length: 200 }, (_, i) =>
			row(`live${i}`, `2026-08-04T16:${String(i % 60).padStart(2, "0")}:00-07:00`, `live ${i}`)
		);
		bridge.api.getChannelMessages = vi.fn().mockResolvedValue({
			ok: true,
			data: { messages: live, next_cursor: "CUR1", num_messages: 400 }
		});

		const room = makeRoom();
		await room.join("PAKBKoJ7", { userId: ME });
		expect(room.chat.messages).toHaveLength(200);

		bridge.api.getChannelMessages = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				messages: [row("old1", "2026-08-04T15:00:00-07:00", "from the past")],
				next_cursor: null
			}
		});

		await room.loadOlder();
		expect(room.chat.messages).toHaveLength(201);
		expect(room.chat.messages[0].message).toBe("from the past");
	});
});
