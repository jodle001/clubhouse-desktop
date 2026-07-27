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
		// user_profile_id is how the room knows which of these people is you;
		// the real API always sends it.
		data: {
			success: true,
			channel: "C1",
			channel_id: 1,
			user_profile_id: 9,
			users,
			user_capabilities: {}
		}
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
		bridge.api.becomeSpeaker = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
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

		expect(bridge.api.becomeSpeaker).toHaveBeenCalledWith("C1");
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

		bridge.api.becomeSpeaker = vi
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
		expect(bridge.api.becomeSpeaker).not.toHaveBeenCalled();
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
		bridge.api.becomeSpeaker = vi.fn().mockResolvedValue({
			ok: false,
			error: { message: "Clubhouse returned HTTP 404", status: 404 }
		});

		const room = makeRoom();
		await room.join("C1", { userId: 9 });

		await expect(room.acceptInvite()).resolves.toBe(false);
		expect(room.invite.value.error).toMatch(/404/);
	});
});

describe("the audio role follows the stage", () => {
	/**
	 * Agora's live mode starts everybody as audience, and audience cannot
	 * publish. Getting the role wrong means a microphone that looks live and
	 * is silent - the same invisible failure as the dropped invitation.
	 */
	let audio;

	function makeRoomWithAudio() {
		const room = useRoom({
			makeAudio: async () => {
				audio = new FakeAudioEngine();
				return audio;
			},
			makeEvents: async () => {
				events = new FakeRoomEvents();
				return events;
			}
		});

		Object.defineProperty(room, "_events", { get: () => events });
		return room;
	}

	const roleCalls = () => audio.calls.filter(([name]) => name === "setRole").map(([, role]) => role);

	beforeEach(() => {
		bridge.api.becomeSpeaker = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
	});

	it("stays audience for a listener", async () => {
		joinWith([person(9)]);
		const room = makeRoomWithAudio();
		await room.join("C1", { userId: 9 });

		expect(roleCalls()).toEqual([]);
		expect(audio.role()).toBe("audience");
	});

	it("takes the host role when joining as a speaker already", async () => {
		joinWith([person(9, { is_speaker: true })]);
		const room = makeRoomWithAudio();
		await room.join("C1", { userId: 9 });

		expect(roleCalls()).toContain("host");
	});

	it("takes the host role on accepting an invitation", async () => {
		joinWith([person(9)]);
		const room = makeRoomWithAudio();
		await room.join("C1", { userId: 9 });

		room._events.deliver({ action: "invite_speaker", channel: "C1", from_name: "Mod", from_user_id: 1 });
		await room.acceptInvite();

		expect(roleCalls()).toContain("host");
	});

	it("takes the host role when a moderator adds you directly", async () => {
		joinWith([person(9)]);
		const room = makeRoomWithAudio();
		await room.join("C1", { userId: 9 });

		room._events.deliver({ action: "add_speaker", channel: "C1", user_id: 9 });
		await new Promise(resolve => setTimeout(resolve, 0));

		expect(roleCalls()).toContain("host");
	});

	it("ignores somebody else being added", async () => {
		joinWith([person(9), person(5)]);
		const room = makeRoomWithAudio();
		await room.join("C1", { userId: 9 });

		room._events.deliver({ action: "add_speaker", channel: "C1", user_id: 5 });
		await new Promise(resolve => setTimeout(resolve, 0));

		expect(roleCalls()).toEqual([]);
	});

	it("drops back to audience and mutes when taken off stage", async () => {
		joinWith([person(9, { is_speaker: true })]);
		const room = makeRoomWithAudio();
		await room.join("C1", { userId: 9 });

		room._events.deliver({ action: "remove_speaker", channel: "C1", user_id: 9 });
		await new Promise(resolve => setTimeout(resolve, 0));

		expect(roleCalls().at(-1)).toBe("audience");
		expect(room.muted.value).toBe(true);
	});

	it("knows whether you are on stage, and follows a promotion", async () => {
		joinWith([person(9), person(1, { is_speaker: true })]);
		const room = makeRoomWithAudio();
		await room.join("C1", { userId: 9 });

		expect(room.isSpeaker.value).toBe(false);

		room._events.deliver({ action: "add_speaker", channel: "C1", user_id: 9 });
		await new Promise(resolve => setTimeout(resolve, 0));

		expect(room.isSpeaker.value).toBe(true);
	});
});

describe("the token that comes with the stage", () => {
	/**
	 * Clubhouse issues an Agora token per role. The one from join_channel only
	 * permits listening, so a promotion that changes the role and keeps the old
	 * credential produces "Can't publish stream, haven't joined yet!" - a
	 * microphone button that does nothing at all.
	 */
	let audio;

	function makeRoomWithAudio() {
		const room = useRoom({
			makeAudio: async () => {
				audio = new FakeAudioEngine();
				return audio;
			},
			makeEvents: async () => {
				events = new FakeRoomEvents();
				return events;
			}
		});

		Object.defineProperty(room, "_events", { get: () => events });
		return room;
	}

	const names = () => audio.calls.map(([name]) => name);

	beforeEach(() => {
		joinWith([person(9, { is_invited_as_speaker: true })]);
	});

	it("renews the publisher token become_speaker hands back", async () => {
		bridge.api.becomeSpeaker = vi.fn().mockResolvedValue({
			ok: true,
			data: { success: true, token: "PUBLISHER-TOKEN", should_join_muted: true }
		});

		const room = makeRoomWithAudio();
		await room.join("C1", { userId: 9 });
		await expect(room.acceptInvite()).resolves.toBe(true);

		expect(audio.calls).toContainEqual(["renewToken", "PUBLISHER-TOKEN"]);

		// Before the role moves, so the client never holds host rights on a
		// listener's credential.
		expect(names().indexOf("renewToken")).toBeLessThan(names().lastIndexOf("setRole"));
	});

	it("arrives on stage muted when the server says so", async () => {
		bridge.api.becomeSpeaker = vi.fn().mockResolvedValue({
			ok: true,
			data: { success: true, token: "T", should_join_muted: true }
		});

		const room = makeRoomWithAudio();
		await room.join("C1", { userId: 9 });
		await room.acceptInvite();

		expect(audio.calls).toContainEqual(["setMuted", true]);
		expect(room.muted.value).toBe(true);
	});

	it("does not mute when the server explicitly says not to", async () => {
		bridge.api.becomeSpeaker = vi.fn().mockResolvedValue({
			ok: true,
			data: { success: true, token: "T", should_join_muted: false }
		});

		const room = makeRoomWithAudio();
		await room.join("C1", { userId: 9 });
		await room.acceptInvite();

		expect(audio.calls).not.toContainEqual(["setMuted", true]);
	});

	it("still takes the stage when no token comes back", async () => {
		// A response without one should not stop the promotion; the adapters
		// ignore an empty token rather than throwing.
		bridge.api.becomeSpeaker = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });

		const room = makeRoomWithAudio();
		await room.join("C1", { userId: 9 });

		await expect(room.acceptInvite()).resolves.toBe(true);
		expect(room.isSpeaker.value).toBe(true);
	});
});

describe("a microphone that refuses", () => {
	let audio;

	function makeRoomWithAudio() {
		const room = useRoom({
			makeAudio: async () => {
				audio = new FakeAudioEngine();
				return audio;
			},
			makeEvents: async () => new FakeRoomEvents()
		});

		return room;
	}

	it("says why instead of leaving a dead button", async () => {
		// Unhandled, the rejection left `muted` untouched and reported nothing,
		// so a refusal and a broken button looked exactly the same.
		joinWith([person(9, { is_speaker: true })]);
		const room = makeRoomWithAudio();
		await room.join("C1", { userId: 9 });

		audio.setMuted = () => Promise.reject(new Error("Can't publish stream, haven't joined yet!"));

		await expect(room.toggleMute()).resolves.toBeUndefined();

		expect(room.audioError.value).toMatch(/publish/);
		expect(room.muted.value).toBe(true);
	});

	it("clears the complaint once it works", async () => {
		joinWith([person(9, { is_speaker: true })]);
		const room = makeRoomWithAudio();
		await room.join("C1", { userId: 9 });

		const working = audio.setMuted.bind(audio);
		audio.setMuted = () => Promise.reject(new Error("nope"));
		await room.toggleMute();
		expect(room.audioError.value).toBe("nope");

		audio.setMuted = working;
		await room.toggleMute();

		expect(room.audioError.value).toBe("");
		expect(room.muted.value).toBe(false);
	});
});
