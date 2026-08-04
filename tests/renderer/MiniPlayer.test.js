import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MiniPlayer from "@/components/MiniPlayer.vue";
import { useSharedRoom } from "@/composables/useRoom.js";
import { stubBridge } from "../setup.js";
import { sessionState } from "@/composables/useSession.js";

vi.mock("@/audio/index.js", async () => {
	const actual = await vi.importActual("@/audio/index.js");
	return { ...actual, createAudioEngine: async () => new actual.FakeAudioEngine() };
});

vi.mock("@/room/index.js", async () => {
	const actual = await vi.importActual("@/room/index.js");
	return { ...actual, createRoomEvents: async () => new actual.FakeRoomEvents() };
});

const RouterLinkStub = { props: ["to"], template: "<a><slot /></a>" };

let bridge;

function joinResult(overrides = {}) {
	return {
		success: true,
		channel: "C1",
		topic: "God & Philosophy",
		user_profile_id: 7,
		users: [{ user_id: 7, name: "Me", is_speaker: true }],
		user_capabilities: {},
		...overrides
	};
}

function mountMini() {
	return mount(MiniPlayer, { global: { stubs: { RouterLink: RouterLinkStub } } });
}

beforeEach(() => {
	sessionState.settings = {};
	bridge = stubBridge();
	bridge.api.joinChannel = vi.fn().mockResolvedValue({ ok: true, data: joinResult() });
	bridge.api.leaveChannel = vi.fn().mockResolvedValue({ ok: true, data: {} });
});

afterEach(async () => {
	await useSharedRoom().leave();
});

describe("MiniPlayer", () => {
	it("renders nothing when no room is live", () => {
		const wrapper = mountMini();
		expect(wrapper.find(".mini").exists()).toBe(false);
	});

	it("shows the live room from anywhere in the app", async () => {
		await useSharedRoom().join("C1", { userId: 7 });

		const wrapper = mountMini();
		expect(wrapper.find(".mini").exists()).toBe(true);
		expect(wrapper.text()).toContain("God & Philosophy");
		expect(wrapper.text()).toContain("1 speaking");
	});

	it("hangs up from its Leave button", async () => {
		const room = useSharedRoom();
		await room.join("C1", { userId: 7 });

		const wrapper = mountMini();
		await wrapper.find(".btn-danger").trigger("click");
		await new Promise(resolve => setTimeout(resolve, 0));

		expect(bridge.api.leaveChannel).toHaveBeenCalledWith("C1");
		expect(room.channel.info).toBeNull();
	});

	it("disappears once the room ends", async () => {
		const room = useSharedRoom();
		await room.join("C1", { userId: 7 });

		const wrapper = mountMini();
		expect(wrapper.find(".mini").exists()).toBe(true);

		await room.leave();
		await wrapper.vm.$nextTick();

		expect(wrapper.find(".mini").exists()).toBe(false);
	});

	it("offers the microphone only to a speaker with audio on", async () => {
		// A listener has nothing to mute; showing the button would promise
		// something the room will refuse.
		sessionState.settings = { audioEnabled: true };
		await useSharedRoom().join("C1", { userId: 7 });

		const wrapper = mountMini();
		expect(wrapper.find(".btn-secondary").exists()).toBe(true);
	});

	it("hides the microphone from a listener", async () => {
		sessionState.settings = { audioEnabled: true };
		bridge.api.joinChannel = vi.fn().mockResolvedValue({
			ok: true,
			data: joinResult({ users: [{ user_id: 7, name: "Me", is_speaker: false }] })
		});
		await useSharedRoom().join("C1", { userId: 7 });

		const wrapper = mountMini();
		expect(wrapper.find(".btn-secondary").exists()).toBe(false);
	});
});
