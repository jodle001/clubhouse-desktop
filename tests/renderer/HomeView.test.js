import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import HomeView from "@/views/HomeView.vue";
import { stubBridge } from "../setup.js";

vi.mock("vue-router", () => ({
	useRouter: () => ({ push: vi.fn() }),
	useRoute: () => ({ query: {} }),
	RouterLink: { template: "<a><slot /></a>" }
}));

/** The shape /get_feed_v3 actually returns, trimmed to what the UI reads. */
function feed() {
	return {
		items: [
			{
				channel: {
					channel_id: 936225955,
					channel: "PD8Ll1l1",
					topic: "Several Crazy People In One Room",
					num_speakers: 10,
					num_all: 30,
					is_private: false,
					users: [{ user_id: 1641671, name: "McZed", username: "thatjewishguy", is_speaker: true }]
				}
			},
			{
				channel: {
					channel_id: 2,
					channel: "AAAA",
					topic: "Quiet room",
					num_speakers: 1,
					num_all: 2,
					is_private: false,
					users: []
				}
			}
		],
		available_topics: [
			{ key: "faith_spirituality", display_name: "faith" },
			{ key: "tech", display_name: "tech" }
		]
	};
}

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

// Renders its slot, unlike `stubs: { RouterLink: true }`, so room content is
// still in the output. RoomCard's class falls through to the anchor.
const RouterLinkStub = { props: ["to"], template: "<a><slot /></a>" };

const mountHome = () => mount(HomeView, { global: { stubs: { RouterLink: RouterLinkStub } } });

describe("HomeView", () => {
	beforeEach(() => {
		vi.useRealTimers();
		stubBridge();
	});

	it("lists the rooms carried inside feed items", async () => {
		const bridge = stubBridge();
		bridge.api.getFeed = vi.fn().mockResolvedValue({ ok: true, data: feed() });

		const wrapper = mountHome();
		await flush();
		await wrapper.vm.$nextTick();

		expect(bridge.api.getFeed).toHaveBeenCalled();
		expect(wrapper.text()).toContain("Several Crazy People In One Room");
		expect(wrapper.text()).toContain("Quiet room");
	});

	it("ignores feed items that are not rooms", async () => {
		// The feed is a mixed stream; only some items wrap a channel.
		const mixed = feed();
		mixed.items.push({ some_other_kind: { id: 1 } });

		const bridge = stubBridge();
		bridge.api.getFeed = vi.fn().mockResolvedValue({ ok: true, data: mixed });

		const wrapper = mountHome();
		await flush();
		await wrapper.vm.$nextTick();

		expect(wrapper.findAll(".room-card")).toHaveLength(2);
	});

	it("shows the topics the feed offers", async () => {
		const bridge = stubBridge();
		bridge.api.getFeed = vi.fn().mockResolvedValue({ ok: true, data: feed() });

		const wrapper = mountHome();
		await flush();
		await wrapper.vm.$nextTick();

		expect(wrapper.text()).toContain("faith");
		expect(wrapper.text()).toContain("tech");
	});

	it("filters rooms by topic and by speaker name", async () => {
		const bridge = stubBridge();
		bridge.api.getFeed = vi.fn().mockResolvedValue({ ok: true, data: feed() });

		const wrapper = mountHome();
		await flush();
		await wrapper.vm.$nextTick();

		await wrapper.find("input[type=search]").setValue("mczed");
		expect(wrapper.findAll(".room-card")).toHaveLength(1);

		await wrapper.find("input[type=search]").setValue("quiet");
		expect(wrapper.findAll(".room-card")).toHaveLength(1);
	});

	it("does not blow up when the feed call fails", async () => {
		const bridge = stubBridge();
		bridge.api.getFeed = vi
			.fn()
			.mockResolvedValue({ ok: false, error: { message: "Not found", status: 404 } });

		const wrapper = mountHome();
		await flush();
		await wrapper.vm.$nextTick();

		expect(wrapper.text()).toContain("No rooms match right now.");
	});
});
