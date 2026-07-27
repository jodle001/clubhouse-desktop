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

let events;

function makeRoom() {
	const room = useRoom({
		makeAudio: async () => new FakeAudioEngine(),
		makeEvents: async () => {
			events = new FakeRoomEvents();
			return events;
		}
	});

	// Handy in tests: push events in as PubNub would.
	Object.defineProperty(room, "_events", { get: () => events });
	return room;
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

describe("being invited to speak", () => {
	beforeEach(() => {
		bridge.api.acceptSpeakerInvite = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
		bridge.api.raiseHand = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
	});

	/** The event exactly as PubNub delivered it. */
	const inviteEvent = {
		action: "invite_speaker",
		channel: "C1",
		from_name: "Andrew R.",
		from_user_id: 2112937972
	};

	function joinAsListener() {
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				success: true,
				channel: "C1",
				channel_id: 1,
				user_profile_id: 9,
				users: [person(9), person(2112937972, { is_speaker: true, is_moderator: true })],
				user_capabilities: {}
			}
		});
	}

	it("surfaces the invitation instead of dropping it", async () => {
		// It used to arrive and be discarded, so being brought up on stage was
		// indistinguishable from being ignored.
		joinAsListener();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		expect(room.invite.value).toBeNull();

		room._events.deliver(inviteEvent);

		expect(room.invite.value).toEqual({ fromName: "Andrew R.", fromUserId: 2112937972 });
	});

	it("accepting moves you onto the stage", async () => {
		joinAsListener();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });
		room._events.deliver(inviteEvent);

		await expect(room.acceptInvite()).resolves.toBe(true);

		expect(bridge.api.acceptSpeakerInvite).toHaveBeenCalledWith("C1", 9);
		expect(room.speakers.value.map(u => u.user_id)).toContain(9);
		expect(room.invite.value).toBeNull();
	});

	it("lowers a raised hand once you are up", async () => {
		joinAsListener();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });
		await room.toggleHand();
		expect(room.handRaised.value).toBe(true);

		room._events.deliver(inviteEvent);
		await room.acceptInvite();

		expect(room.handRaised.value).toBe(false);
	});

	it("keeps the invitation up if accepting fails", async () => {
		joinAsListener();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });
		room._events.deliver(inviteEvent);

		bridge.api.acceptSpeakerInvite = vi
			.fn()
			.mockResolvedValue({ ok: false, error: { message: "Nope", status: 400 } });

		await expect(room.acceptInvite()).resolves.toBe(false);
		expect(room.invite.value).not.toBeNull();
		expect(room.speakers.value.map(u => u.user_id)).not.toContain(9);
	});

	it("declining just dismisses it", async () => {
		joinAsListener();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });
		room._events.deliver(inviteEvent);

		room.declineInvite();

		expect(room.invite.value).toBeNull();
		expect(bridge.api.acceptSpeakerInvite).not.toHaveBeenCalled();
	});

	it("forgets an unanswered invitation on leaving", async () => {
		joinAsListener();
		const room = makeRoom();
		await room.join("C1", { userId: 9 });
		room._events.deliver(inviteEvent);

		await room.leave();

		expect(room.invite.value).toBeNull();
	});
});

describe("an invitation that predates this session", () => {
	it("shows one that join_channel reports on your own record", async () => {
		// The PubNub event fires once. Joining a room where a moderator already
		// beckoned has to pick it up from is_invited_as_speaker instead.
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				success: true,
				channel: "C1",
				user_profile_id: 9,
				users: [person(9, { is_invited_as_speaker: true })],
				user_capabilities: {}
			}
		});

		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		expect(room.invite.value).not.toBeNull();
	});

	it("does not badger somebody who is already a speaker", async () => {
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				success: true,
				channel: "C1",
				user_profile_id: 9,
				users: [person(9, { is_invited_as_speaker: true, is_speaker: true })],
				user_capabilities: {}
			}
		});

		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		expect(room.invite.value).toBeNull();
	});

	it("reports a failed accept on the invitation, where it can be seen", async () => {
		// `error` only renders when there is no room at all, so a failure put
		// there was invisible - which is the bug this whole feature was fixing.
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				success: true,
				channel: "C1",
				user_profile_id: 9,
				users: [person(9, { is_invited_as_speaker: true })],
				user_capabilities: {}
			}
		});
		bridge.api.acceptSpeakerInvite = vi.fn().mockResolvedValue({
			ok: false,
			error: { message: "Clubhouse returned HTTP 404", status: 404 }
		});

		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		await expect(room.acceptInvite()).resolves.toBe(false);
		expect(room.invite.value.error).toMatch(/404/);
	});
});
