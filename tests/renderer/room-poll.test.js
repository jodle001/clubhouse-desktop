import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRoom } from "@/composables/useRoom.js";
import { FakeAudioEngine } from "@/audio/index.js";
import { FakeRoomEvents } from "@/room/index.js";
import { stubBridge } from "../setup.js";

const ME = 1284234101;

/** The poll block as join_channel and /get_channel_user_poll carry it. */
function pollBlock(overrides = {}) {
	return {
		poll_metadata: {
			poll_id: "b5cf0afb",
			poll_title: "Which fruit is the best for a snack?",
			poll_options: [
				{ poll_option_id: "opt-apple", poll_option_title: "Apples" },
				{ poll_option_id: "opt-orange", poll_option_title: "Oranges" },
				{ poll_option_id: "opt-banana", poll_option_title: "Bananas" }
			]
		},
		poll_results: {
			total_votes_text: "0 votes",
			poll_option_results: [
				{ poll_option_id: "opt-apple", percentage: 0 },
				{ poll_option_id: "opt-orange", percentage: 0 },
				{ poll_option_id: "opt-banana", percentage: 0 }
			]
		},
		poll_colors: [{ light_hex: "#80DFB3", dark_hex: "#5C957A" }],
		...overrides
	};
}

function joinResult(overrides = {}) {
	return {
		success: true,
		channel: "C1",
		user_profile_id: ME,
		users: [{ user_id: ME, name: "Me" }],
		is_channel_user_poll_enabled: true,
		user_capabilities: { can_manage_channel_user_poll: true },
		channel_user_poll: pollBlock(),
		...overrides
	};
}

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

beforeEach(() => {
	events = null;
	bridge = stubBridge();
	bridge.api.joinChannel = vi.fn().mockResolvedValue({ ok: true, data: joinResult() });
	bridge.api.leaveChannel = vi.fn().mockResolvedValue({ ok: true, data: {} });
});

afterEach(async () => {
	vi.restoreAllMocks();
});

describe("room polls", () => {
	it("reads the poll off join_channel, palette and all", async () => {
		const room = makeRoom();
		await room.join("C1", { userId: ME });

		expect(room.pollEnabled.value).toBe(true);
		expect(room.canManagePoll.value).toBe(true);
		expect(room.poll.metadata.poll_title).toContain("fruit");
		expect(room.poll.metadata.poll_options).toHaveLength(3);
		expect(room.poll.colors[0].light_hex).toBe("#80DFB3");
	});

	it("marks the option this viewer already chose", async () => {
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: joinResult({
				users: [{ user_id: ME, name: "Me", selected_poll_option_id: "opt-orange" }]
			})
		});

		const room = makeRoom();
		await room.join("C1", { userId: ME });

		expect(room.poll.mySelectionId).toBe("opt-orange");
	});

	it("has no poll when the room carries none", async () => {
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: joinResult({ channel_user_poll: { poll_metadata: null, poll_results: null } })
		});

		const room = makeRoom();
		await room.join("C1", { userId: ME });

		expect(room.poll.metadata).toBeNull();
	});

	it("votes with poll_id and poll_option_id, then re-reads the tally", async () => {
		// The verb is submit_channel_user_poll_vote; percentages are the
		// server's to compute, so a vote is followed by a fresh read.
		bridge.api.voteChannelPoll = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
		bridge.api.getChannelPoll = vi.fn().mockResolvedValue({
			ok: true,
			data: pollBlock({
				poll_results: {
					total_votes_text: "1 votes",
					poll_option_results: [
						{ poll_option_id: "opt-apple", percentage: 100 },
						{ poll_option_id: "opt-orange", percentage: 0 },
						{ poll_option_id: "opt-banana", percentage: 0 }
					]
				}
			})
		});

		const room = makeRoom();
		await room.join("C1", { userId: ME });

		expect(await room.votePoll("opt-apple")).toBe(true);

		expect(bridge.api.voteChannelPoll).toHaveBeenCalledWith({
			channel: "C1",
			pollId: "b5cf0afb",
			pollOptionId: "opt-apple"
		});
		expect(room.poll.mySelectionId).toBe("opt-apple");
		expect(room.poll.results.total_votes_text).toBe("1 votes");
		expect(room.poll.results.poll_option_results[0].percentage).toBe(100);
	});

	it("puts the selection back when a vote is refused", async () => {
		bridge.api.voteChannelPoll = vi
			.fn()
			.mockResolvedValue({ ok: false, error: { message: "Nope", status: 400 } });

		const room = makeRoom();
		await room.join("C1", { userId: ME });

		expect(await room.votePoll("opt-apple")).toBe(false);
		expect(room.poll.mySelectionId).toBeNull();
		expect(room.poll.error).toBe("Nope");
	});

	it("creates a poll from a title and options", async () => {
		bridge.api.createChannelPoll = vi.fn().mockResolvedValue({
			ok: true,
			data: pollBlock({ poll_metadata: { poll_id: "new1", poll_title: "Tea or coffee?", poll_options: [] } })
		});
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: joinResult({ channel_user_poll: { poll_metadata: null, poll_results: null } })
		});

		const room = makeRoom();
		await room.join("C1", { userId: ME });
		expect(room.poll.metadata).toBeNull();

		const ok = await room.createPoll("  Tea or coffee?  ", ["Tea leaves", "Coffee beans", "   "]);
		expect(ok).toBe(true);

		// Trimmed, and the blank option dropped.
		expect(bridge.api.createChannelPoll).toHaveBeenCalledWith({
			channel: "C1",
			title: "Tea or coffee?",
			options: ["Tea leaves", "Coffee beans"]
		});
		expect(room.poll.metadata.poll_title).toBe("Tea or coffee?");
	});

	it("refreshes on a live poll event, and drops the poll on leaving", async () => {
		bridge.api.getChannelPoll = vi.fn().mockResolvedValue({
			ok: true,
			data: pollBlock({
				poll_results: {
					total_votes_text: "5 votes",
					poll_option_results: [{ poll_option_id: "opt-apple", percentage: 60 }]
				}
			})
		});

		const room = makeRoom();
		await room.join("C1", { userId: ME });

		room._events.deliver({ action: "channel_user_poll_update", channel: "C1" });
		// The handler re-reads asynchronously.
		await Promise.resolve();
		await Promise.resolve();

		expect(bridge.api.getChannelPoll).toHaveBeenCalledWith("C1");
		expect(room.poll.results.total_votes_text).toBe("5 votes");

		await room.leave();
		expect(room.poll.metadata).toBeNull();
		expect(room.poll.colors).toEqual([]);
	});
});

describe("room settings", () => {
	function joinRoom(overrides = {}) {
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				success: true,
				channel: "C1",
				topic: "MyRoom",
				user_profile_id: ME,
				users: [{ user_id: ME, name: "Me", is_moderator: true }],
				is_room_chat_available: true,
				is_chat_enabled: false,
				chat_permission: 1,
				chat_permission_options: [
					{ value: 1, label: "everyone" },
					{ value: 2, label: "followers of the host" }
				],
				handraise_queue_setting: 0,
				user_capabilities: {
					can_disable_room_chat: true,
					can_edit_room_title: true,
					can_edit_handraise_queue: true,
					can_post_to_chat: false
				},
				...overrides
			}
		});
	}

	it("reads the settings off the room", async () => {
		joinRoom();
		const room = makeRoom();
		await room.join("C1", { userId: ME });

		expect(room.roomSettings.value).toMatchObject({
			title: "MyRoom",
			isChatEnabled: false,
			chatPermission: 1,
			handraiseQueueSetting: 0
		});
		expect(room.roomSettings.value.chatPermissionOptions).toHaveLength(2);
	});

	it("turns chat on, which opens the panel and lets a moderator post", async () => {
		joinRoom();
		bridge.api.enableRoomChat = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
		bridge.api.getChannelMessages = vi.fn().mockResolvedValue({ ok: true, data: { messages: [] } });

		const room = makeRoom();
		await room.join("C1", { userId: ME });
		expect(room.chat.enabled).toBe(false);

		expect(await room.setRoomChat(true)).toBe(true);

		expect(bridge.api.enableRoomChat).toHaveBeenCalledWith("C1");
		expect(room.roomSettings.value.isChatEnabled).toBe(true);
		expect(room.chat.enabled).toBe(true);
		expect(room.chat.canPost).toBe(true);
		expect(bridge.api.getChannelMessages).toHaveBeenCalled();
	});

	it("turns chat off again", async () => {
		joinRoom({ is_chat_enabled: true });
		bridge.api.disableRoomChat = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });

		const room = makeRoom();
		await room.join("C1", { userId: ME });

		expect(await room.setRoomChat(false)).toBe(true);
		expect(bridge.api.disableRoomChat).toHaveBeenCalledWith("C1");
		expect(room.chat.enabled).toBe(false);
		expect(room.chat.canPost).toBe(false);
	});

	it("changes who can chat", async () => {
		joinRoom();
		bridge.api.setChatPermission = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });

		const room = makeRoom();
		await room.join("C1", { userId: ME });

		expect(await room.changeChatPermission(2)).toBe(true);
		expect(bridge.api.setChatPermission).toHaveBeenCalledWith("C1", 2);
		expect(room.roomSettings.value.chatPermission).toBe(2);
	});

	it("toggles hand raising through the queue setting", async () => {
		joinRoom();
		bridge.api.setHandraiseQueue = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });

		const room = makeRoom();
		await room.join("C1", { userId: ME });

		expect(await room.changeHandraise(1)).toBe(true);
		expect(bridge.api.setHandraiseQueue).toHaveBeenCalledWith("C1", 1);
		expect(room.roomSettings.value.handraiseQueueSetting).toBe(1);
	});

	it("renames the room, trimmed", async () => {
		joinRoom();
		bridge.api.setChannelTitle = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });

		const room = makeRoom();
		await room.join("C1", { userId: ME });

		expect(await room.renameRoom("  New name  ")).toBe(true);
		expect(bridge.api.setChannelTitle).toHaveBeenCalledWith("C1", "New name");
		expect(room.roomSettings.value.title).toBe("New name");
	});

	it("reports a refused change and does not patch the room", async () => {
		joinRoom();
		bridge.api.setChatPermission = vi
			.fn()
			.mockResolvedValue({ ok: false, error: { message: "Not allowed", status: 400 } });

		const room = makeRoom();
		await room.join("C1", { userId: ME });

		expect(await room.changeChatPermission(3)).toBe(false);
		expect(room.roomSettingsError.value).toBe("Not allowed");
		expect(room.roomSettings.value.chatPermission).toBe(1);
	});
});
