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
