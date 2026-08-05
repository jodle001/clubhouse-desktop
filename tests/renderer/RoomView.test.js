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
