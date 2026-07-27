import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRoom } from "@/composables/useRoom.js";
import { FakeAudioEngine } from "@/audio/index.js";
import { FakeRoomEvents } from "@/room/index.js";
import { stubBridge } from "../setup.js";

/** Flags exactly as join_channel sends them. */
const person = (id, flags = {}) => ({
	user_id: id,
	name: `User ${id}`,
	username: `u${id}`,
	is_speaker: false,
	is_moderator: false,
	is_followed_by_speaker: false,
	is_social_club_member: false,
	...flags
});

let bridge;

function makeRoom() {
	return useRoom({
		makeAudio: async () => new FakeAudioEngine(),
		makeEvents: async () => new FakeRoomEvents()
	});
}

function joinWith(users) {
	bridge.api.joinChannel = vi.fn().mockResolvedValue({
		ok: true,
		data: { success: true, channel: "C1", channel_id: 1, users, user_capabilities: {} }
	});
}

beforeEach(() => {
	bridge = stubBridge();
	bridge.api.leaveChannel = vi.fn().mockResolvedValue({ ok: true, data: {} });
});

describe("the audience, grouped the way the phone app groups it", () => {
	it("separates speakers, people the speakers follow, house members and the rest", async () => {
		joinWith([
			person(1, { is_speaker: true }),
			person(2, { is_followed_by_speaker: true }),
			person(3, { is_social_club_member: true }),
			person(4)
		]);

		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		expect(room.speakers.value.map(u => u.user_id)).toEqual([1]);
		expect(room.followedBySpeakers.value.map(u => u.user_id)).toEqual([2]);
		expect(room.houseMembers.value.map(u => u.user_id)).toEqual([3]);
		expect(room.others.value.map(u => u.user_id)).toEqual([4]);
	});

	it("puts each person in exactly one group", async () => {
		// Somebody can be both followed by a speaker and a house member; the
		// order of the groups decides, and nobody should be listed twice.
		joinWith([
			person(1, { is_speaker: true, is_followed_by_speaker: true, is_social_club_member: true }),
			person(2, { is_followed_by_speaker: true, is_social_club_member: true })
		]);

		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		const listed = [
			...room.speakers.value,
			...room.followedBySpeakers.value,
			...room.houseMembers.value,
			...room.others.value
		].map(u => u.user_id);

		expect(listed).toEqual([1, 2]);
		expect(new Set(listed).size).toBe(listed.length);
	});

	it("counts everyone somewhere", async () => {
		joinWith([
			person(1, { is_speaker: true }),
			person(2, { is_followed_by_speaker: true }),
			person(3),
			person(4, { is_social_club_member: true })
		]);

		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		const total =
			room.speakers.value.length +
			room.followedBySpeakers.value.length +
			room.houseMembers.value.length +
			room.others.value.length;

		expect(total).toBe(4);
	});

	it("regroups a listener who is made a speaker", async () => {
		joinWith([person(1, { is_speaker: true }), person(2)]);

		const room = makeRoom();
		await room.join("C1", { userId: 9 });
		expect(room.others.value.map(u => u.user_id)).toEqual([2]);

		room._internals.patchUser(2, { is_speaker: true });

		expect(room.speakers.value.map(u => u.user_id)).toEqual([1, 2]);
		expect(room.others.value).toHaveLength(0);
	});
});
