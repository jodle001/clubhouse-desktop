import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import RoomView from "@/views/RoomView.vue";
import { stubBridge } from "../setup.js";
import { sessionState } from "@/composables/useSession.js";

vi.mock("vue-router", () => ({
	useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
	useRoute: () => ({})
}));

// The view builds its own room, so the only way to keep the real Agora SDK out
// of a test that turns audio on is to swap the factory.
vi.mock("@/audio/index.js", async () => {
	const actual = await vi.importActual("@/audio/index.js");
	return { ...actual, createAudioEngine: async () => new actual.FakeAudioEngine() };
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
