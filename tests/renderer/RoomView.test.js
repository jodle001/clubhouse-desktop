import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import RoomView from "@/views/RoomView.vue";
import { useSharedRoom } from "@/composables/useRoom.js";
import { stubBridge } from "../setup.js";
import { sessionState } from "@/composables/useSession.js";

vi.mock("vue-router", () => ({
	useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
	useRoute: () => ({})
}));

// The shared room uses the real factories, so swap both: Agora must not load,
// and PubNub must not open sockets from a test.
vi.mock("@/audio/index.js", async () => {
	const actual = await vi.importActual("@/audio/index.js");
	return { ...actual, createAudioEngine: async () => new actual.FakeAudioEngine() };
});

vi.mock("@/room/index.js", async () => {
	const actual = await vi.importActual("@/room/index.js");
	return { ...actual, createRoomEvents: async () => new actual.FakeRoomEvents() };
});

const joinResult = (overrides = {}) => ({
	success: true,
	channel: "C1",
	channel_id: 1,
	topic: "God & Philosophy",
	user_profile_id: 7,
	users: [{ user_id: 7, name: "Me", is_speaker: true }],
	is_room_chat_available: true,
	is_chat_enabled: true,
	user_capabilities: { can_post_to_chat: true },
	...overrides
});

let bridge;

beforeEach(() => {
	// Session state is a module singleton, so a setting saved by one test is
	// still there for the next one - which is correct in the app and wrong in
	// a test.
	sessionState.settings = {};

	bridge = stubBridge();
	bridge.api.joinChannel = vi.fn().mockResolvedValue({ ok: true, data: joinResult() });
	bridge.api.leaveChannel = vi.fn().mockResolvedValue({ ok: true, data: {} });
	// The real handler answers with the whole settings object.
	bridge.settings.set = vi.fn(patch => Promise.resolve({ ...patch }));
});

// The room is a module singleton now - that is the feature - so each test must
// hang up, or the next one starts inside this one's room.
afterEach(async () => {
	await useSharedRoom().leave();
});

function mountRoom() {
	return mount(RoomView, { props: { channel: "C1" }, global: { stubs: { RouterLink: true } } });
}

/**
 * join() awaits the API, the audio engine and the events adapter in turn, so
 * one microtask tick is not enough for the room to be on screen.
 */
async function settle(wrapper) {
	await new Promise(resolve => setTimeout(resolve, 50));
	await wrapper.vm.$nextTick();
}

describe("RoomView chat panel", () => {
	it("puts chat in an aside beside the room, not below it", async () => {
		const wrapper = mountRoom();
		await settle(wrapper);

		expect(wrapper.find(".room__main").exists()).toBe(true);
		expect(wrapper.find(".room__aside").exists()).toBe(true);
		expect(wrapper.find(".room__panel").exists()).toBe(true);
	});

	it("opens by default and says so", async () => {
		const wrapper = mountRoom();
		await settle(wrapper);

		expect(wrapper.find(".room__tab").attributes("aria-expanded")).toBe("true");
		expect(wrapper.find(".room").classes()).toContain("room--chat-open");
	});

	it("collapses and reopens from the tab", async () => {
		const wrapper = mountRoom();
		await settle(wrapper);

		await wrapper.find(".room__tab").trigger("click");
		expect(wrapper.find(".room__tab").attributes("aria-expanded")).toBe("false");
		expect(wrapper.find(".room").classes()).not.toContain("room--chat-open");

		await wrapper.find(".room__tab").trigger("click");
		expect(wrapper.find(".room__tab").attributes("aria-expanded")).toBe("true");
		expect(wrapper.find(".room").classes()).toContain("room--chat-open");
	});

	it("leaves the tab reachable while collapsed", async () => {
		// Collapsing must not hide the only way back.
		const wrapper = mountRoom();
		await settle(wrapper);
		await wrapper.find(".room__tab").trigger("click");

		expect(wrapper.find(".room__tab").exists()).toBe(true);
		expect(wrapper.find(".room__aside").classes()).toContain("room__aside--closed");
	});

	it("remembers the choice", async () => {
		const wrapper = mountRoom();
		await settle(wrapper);

		await wrapper.find(".room__tab").trigger("click");
		expect(bridge.settings.set).toHaveBeenCalledWith({ chatOpen: false });

		await wrapper.find(".room__tab").trigger("click");
		expect(bridge.settings.set).toHaveBeenLastCalledWith({ chatOpen: true });
	});

	it("shows no chat furniture at all in a room without chat", async () => {
		bridge.api.joinChannel = vi
			.fn()
			.mockResolvedValue({ ok: true, data: joinResult({ is_room_chat_available: false }) });

		const wrapper = mountRoom();
		await settle(wrapper);

		expect(wrapper.find(".room__aside").exists()).toBe(false);
		expect(wrapper.find(".room__tab").exists()).toBe(false);
	});

	it("shows the panel but no composer when posting is not allowed", async () => {
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: joinResult({ user_capabilities: { can_post_to_chat: false } })
		});

		const wrapper = mountRoom();
		await settle(wrapper);

		expect(wrapper.find(".room__panel").exists()).toBe(true);
		expect(wrapper.find(".room__compose").exists()).toBe(false);
	});
});

describe("the microphone button", () => {
	const micButton = wrapper => wrapper.findAll(".room__bar button")[0];

	it("says audio is off rather than claiming a mute you could undo", async () => {
		const wrapper = mountRoom();
		await settle(wrapper);

		expect(micButton(wrapper).attributes("disabled")).toBeDefined();
		expect(micButton(wrapper).text()).toContain("Audio off");
		expect(micButton(wrapper).attributes("title")).toMatch(/Settings/);
	});

	it("says listening for somebody who is not on stage", async () => {
		// A listener is not muted, and calling it that suggests a button that
		// would unmute if you pressed it.
		sessionState.settings = { audioEnabled: true };
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: joinResult({ users: [{ user_id: 7, name: "Me", is_speaker: false }] })
		});

		const wrapper = mountRoom();
		await settle(wrapper);

		expect(micButton(wrapper).attributes("disabled")).toBeDefined();
		expect(micButton(wrapper).text()).toContain("Listening");
		expect(micButton(wrapper).attributes("title")).toMatch(/speakers/i);
	});

	it("works, and says Muted, for a speaker with audio on", async () => {
		sessionState.settings = { audioEnabled: true };

		const wrapper = mountRoom();
		await settle(wrapper);

		expect(micButton(wrapper).attributes("disabled")).toBeUndefined();
		expect(micButton(wrapper).text()).toContain("Muted");
	});
});

describe("raising a hand", () => {
	const barText = wrapper => wrapper.find(".room__bar").text();

	it("is not offered to somebody already speaking", async () => {
		// joinResult puts you on stage, which is what happens when you were
		// already in the room on the phone.
		const wrapper = mountRoom();
		await settle(wrapper);

		expect(barText(wrapper)).not.toMatch(/Raise hand/);
	});

	it("is offered to a listener", async () => {
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: joinResult({ users: [{ user_id: 7, name: "Me", is_speaker: false }] })
		});

		const wrapper = mountRoom();
		await settle(wrapper);

		expect(barText(wrapper)).toMatch(/Raise hand/);
	});
});

describe("the room outliving the view", () => {
	it("does not hang up when the view unmounts", async () => {
		// The old behaviour: onUnmounted called leave(), so opening Settings or
		// a profile kicked you out of the room. The room belongs to the app now.
		const wrapper = mountRoom();
		await settle(wrapper);

		wrapper.unmount();
		await new Promise(resolve => setTimeout(resolve, 10));

		expect(bridge.api.leaveChannel).not.toHaveBeenCalled();
		expect(useSharedRoom().channel.info).not.toBeNull();
	});

	it("finds the call as it was on returning, without rejoining", async () => {
		const first = mountRoom();
		await settle(first);
		first.unmount();

		const second = mountRoom();
		await settle(second);

		// One join for the whole journey: room -> Settings -> room.
		expect(bridge.api.joinChannel).toHaveBeenCalledTimes(1);
		expect(second.find(".room__topic").text()).toBe("God & Philosophy");
	});

	it("moves rooms when the URL names a different one", async () => {
		// vue-router reuses the component when only :channel changes, so the
		// watch is what makes a room-to-room link actually switch rooms.
		const wrapper = mountRoom();
		await settle(wrapper);

		bridge.api.joinChannel = vi
			.fn()
			.mockResolvedValue({ ok: true, data: joinResult({ channel: "C2", topic: "Second room" }) });

		await wrapper.setProps({ channel: "C2" });
		await settle(wrapper);

		expect(bridge.api.leaveChannel).toHaveBeenCalledWith("C1");
		expect(bridge.api.joinChannel).toHaveBeenCalledWith("C2");
		expect(wrapper.find(".room__topic").text()).toBe("Second room");
	});

	it("still leaves for real from the Leave button", async () => {
		const wrapper = mountRoom();
		await settle(wrapper);

		await wrapper.find(".btn-danger").trigger("click");
		await settle(wrapper);

		expect(bridge.api.leaveChannel).toHaveBeenCalledWith("C1");
		expect(useSharedRoom().channel.info).toBeNull();
	});
});

describe("moderator controls over a member", () => {
	function joinAsMod() {
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: joinResult({
				users: [
					{ user_id: 7, name: "Me", is_speaker: true, is_moderator: true },
					{ user_id: 5, name: "Them", is_speaker: true }
				],
				user_capabilities: { can_post_to_chat: true, can_mute_speakers: true }
			})
		});
		bridge.api.getProfile = vi.fn().mockResolvedValue({
			ok: true,
			data: { user_profile: { user_id: 5, name: "Them", username: "them" } }
		});
		bridge.api.me = vi.fn().mockResolvedValue({ ok: true, data: { following_ids: [], blocked_ids: [] } });
	}

	it("offers moderator actions on another member's sheet", async () => {
		joinAsMod();
		const wrapper = mountRoom();
		await settle(wrapper);

		// The second tile is the other speaker.
		await wrapper.findAll(".tile")[1].trigger("click");
		await settle(wrapper);

		expect(wrapper.find(".room__mod").exists()).toBe(true);
		expect(wrapper.find(".room__mod").text()).toMatch(/Move to audience/);
		expect(wrapper.find(".room__mod").text()).toMatch(/Mute/);
	});

	it("shows no moderator actions when you cannot moderate", async () => {
		// Default joinResult makes you a plain speaker, not a moderator.
		bridge.api.getProfile = vi.fn().mockResolvedValue({
			ok: true,
			data: { user_profile: { user_id: 7, name: "Me", username: "me" } }
		});
		bridge.api.me = vi.fn().mockResolvedValue({ ok: true, data: { following_ids: [], blocked_ids: [] } });

		const wrapper = mountRoom();
		await settle(wrapper);
		await wrapper.find(".tile").trigger("click");
		await settle(wrapper);

		expect(wrapper.find(".room__mod").exists()).toBe(false);
	});

	it("does not offer moderator actions against yourself", async () => {
		joinAsMod();
		const wrapper = mountRoom();
		await settle(wrapper);

		// The first tile is you.
		await wrapper.findAll(".tile")[0].trigger("click");
		await settle(wrapper);

		expect(wrapper.find(".room__mod").exists()).toBe(false);
	});
});

describe("opening a profile from a room", () => {
	it("shows a sheet over the room instead of leaving it", async () => {
		bridge.api.getProfile = vi.fn().mockResolvedValue({
			ok: true,
			data: { user_profile: { user_id: 7, name: "Me", username: "me" } }
		});
		bridge.api.me = vi.fn().mockResolvedValue({ ok: true, data: { following_ids: [], blocked_ids: [] } });

		const wrapper = mountRoom();
		await settle(wrapper);

		expect(wrapper.find(".sheet").exists()).toBe(false);

		await wrapper.find(".tile").trigger("click");
		await settle(wrapper);

		expect(wrapper.find(".sheet").exists()).toBe(true);
		// The room is still mounted and still joined.
		expect(wrapper.find(".room__main").exists()).toBe(true);
		expect(bridge.api.leaveChannel).not.toHaveBeenCalled();
	});

	it("closes the sheet without touching the room", async () => {
		bridge.api.getProfile = vi.fn().mockResolvedValue({
			ok: true,
			data: { user_profile: { user_id: 7, name: "Me", username: "me" } }
		});
		bridge.api.me = vi.fn().mockResolvedValue({ ok: true, data: { following_ids: [], blocked_ids: [] } });

		const wrapper = mountRoom();
		await settle(wrapper);
		await wrapper.find(".tile").trigger("click");
		await settle(wrapper);

		await wrapper.find(".sheet").trigger("click");
		await wrapper.vm.$nextTick();

		expect(wrapper.find(".sheet").exists()).toBe(false);
		expect(wrapper.find(".room__main").exists()).toBe(true);
		expect(bridge.api.leaveChannel).not.toHaveBeenCalled();
	});
});

describe("the room poll", () => {
	function joinWithPoll(extra = {}) {
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: joinResult({
				is_channel_user_poll_enabled: true,
				user_capabilities: { can_post_to_chat: true, can_manage_channel_user_poll: true },
				channel_user_poll: {
					poll_metadata: {
						poll_id: "p1",
						poll_title: "Best fruit?",
						poll_options: [
							{ poll_option_id: "a", poll_option_title: "Apples" },
							{ poll_option_id: "b", poll_option_title: "Oranges" }
						]
					},
					poll_results: {
						total_votes_text: "3 votes",
						poll_option_results: [
							{ poll_option_id: "a", percentage: 67 },
							{ poll_option_id: "b", percentage: 33 }
						]
					},
					poll_colors: [{ light_hex: "#80DFB3" }]
				},
				...extra
			})
		});
		bridge.api.voteChannelPoll = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
		bridge.api.getChannelPoll = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				poll_metadata: {
					poll_id: "p1",
					poll_title: "Best fruit?",
					poll_options: [
						{ poll_option_id: "a", poll_option_title: "Apples" },
						{ poll_option_id: "b", poll_option_title: "Oranges" }
					]
				},
				poll_results: {
					total_votes_text: "4 votes",
					poll_option_results: [
						{ poll_option_id: "a", percentage: 75 },
						{ poll_option_id: "b", percentage: 25 }
					]
				}
			}
		});
	}

	it("shows the poll with its options and tally", async () => {
		joinWithPoll();
		const wrapper = mountRoom();
		await settle(wrapper);

		const poll = wrapper.find(".poll");
		expect(poll.exists()).toBe(true);
		expect(poll.text()).toContain("Best fruit?");
		expect(poll.text()).toContain("Apples");
		expect(poll.text()).toContain("67%");
		expect(poll.text()).toContain("3 votes");
	});

	it("votes for an option on click", async () => {
		joinWithPoll();
		const wrapper = mountRoom();
		await settle(wrapper);

		await wrapper.findAll(".poll__option")[0].trigger("click");
		await settle(wrapper);

		expect(bridge.api.voteChannelPoll).toHaveBeenCalledWith({
			channel: "C1",
			pollId: "p1",
			pollOptionId: "a"
		});
		// The re-read tally is shown.
		expect(wrapper.find(".poll").text()).toContain("4 votes");
	});

	it("offers a moderator a start-a-poll form when none is running", async () => {
		joinWithPoll({ channel_user_poll: { poll_metadata: null, poll_results: null } });
		const wrapper = mountRoom();
		await settle(wrapper);

		expect(wrapper.find(".poll__form").exists()).toBe(false);
		await wrapper.find(".poll button").trigger("click");
		expect(wrapper.find(".poll__form").exists()).toBe(true);
	});

	it("lets a Yes/No poll start - short options are not blocked", async () => {
		// The room reports an option minimum of 5, but that is advisory; a
		// two-letter "No" must not disable the button, and the server is left
		// to judge lengths.
		joinWithPoll({ channel_user_poll: { poll_metadata: null, poll_results: null } });
		bridge.api.createChannelPoll = vi.fn().mockResolvedValue({
			ok: true,
			data: { poll_metadata: { poll_id: "n1", poll_title: "Is it Friday?", poll_options: [] }, poll_results: null }
		});

		const wrapper = mountRoom();
		await settle(wrapper);
		await wrapper.find(".poll button").trigger("click");

		const start = () => wrapper.findAll(".poll__form button").at(-1);
		expect(start().attributes("disabled")).toBeDefined();

		const inputs = wrapper.findAll(".poll__input");
		await inputs[0].setValue("Is it Friday?");
		await inputs[1].setValue("Yes");
		await inputs[2].setValue("No");

		expect(start().attributes("disabled")).toBeUndefined();

		await wrapper.find(".poll__form").trigger("submit");
		expect(bridge.api.createChannelPoll).toHaveBeenCalledWith({
			channel: "C1",
			title: "Is it Friday?",
			options: ["Yes", "No"]
		});
	});

	it("is absent when the room does not offer polls", async () => {
		const wrapper = mountRoom();
		await settle(wrapper);

		expect(wrapper.find(".poll").exists()).toBe(false);
	});
});

describe("reacting at a person", () => {
	function joinWithPalette() {
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: joinResult({
				users: [
					{ user_id: 7, name: "Me", is_speaker: true },
					{ user_id: 5, name: "Them", username: "them", is_speaker: true }
				],
				reactions: { channel_reactions: [{ reaction_id: 101, emoji: "❤" }] }
			})
		});
		bridge.api.getProfile = vi.fn().mockResolvedValue({
			ok: true,
			data: { user_profile: { user_id: 5, name: "Them", username: "them" } }
		});
		bridge.api.me = vi.fn().mockResolvedValue({ ok: true, data: { following_ids: [], blocked_ids: [] } });
		bridge.api.sendChannelReaction = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
	}

	it("offers the room's palette on another member's sheet, aimed at them", async () => {
		joinWithPalette();
		const wrapper = mountRoom();
		await settle(wrapper);

		await wrapper.findAll(".tile")[1].trigger("click");
		await settle(wrapper);

		const row = wrapper.find(".room__sheet-react");
		expect(row.exists()).toBe(true);

		await row.find(".room__palette-emoji").trigger("click");
		expect(bridge.api.sendChannelReaction).toHaveBeenCalledWith("C1", 101, 5);
	});

	it("does not offer it on your own sheet - the room bar already does that", async () => {
		joinWithPalette();
		bridge.api.getProfile = vi.fn().mockResolvedValue({
			ok: true,
			data: { user_profile: { user_id: 7, name: "Me", username: "me" } }
		});

		const wrapper = mountRoom();
		await settle(wrapper);

		await wrapper.findAll(".tile")[0].trigger("click");
		await settle(wrapper);

		expect(wrapper.find(".sheet").exists()).toBe(true);
		expect(wrapper.find(".room__sheet-react").exists()).toBe(false);
	});

	it("opens the author's sheet from their name on a chat line", async () => {
		// "Click a person in chat, then pick a reaction" - the name is the way in.
		joinWithPalette();
		bridge.api.getChannelMessages = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				success: true,
				messages: [
					{
						message_id: "M1",
						message: "hello",
						time_created: "2026-08-06T10:00:00Z",
						user_profile: { user_id: 5, name: "Them", username: "them" }
					}
				]
			}
		});

		const wrapper = mountRoom();
		await settle(wrapper);

		const author = wrapper.find(".room__author");
		expect(author.text()).toBe("Them");

		await author.trigger("click");
		await settle(wrapper);

		expect(wrapper.find(".sheet").exists()).toBe(true);
		expect(wrapper.find(".room__sheet-react").exists()).toBe(true);
	});
});
