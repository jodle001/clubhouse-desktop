import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import WavesView from "@/views/WavesView.vue";
import { stubBridge } from "../setup.js";

const push = vi.fn();
vi.mock("vue-router", () => ({ useRouter: () => ({ push }) }));

let bridge;

const settle = async wrapper => {
	await new Promise(resolve => setTimeout(resolve, 0));
	await wrapper.vm.$nextTick();
};

beforeEach(() => {
	push.mockClear();
	bridge = stubBridge();
	bridge.api.getReceivedWaves = vi.fn().mockResolvedValue({ ok: true, data: { waves: [] } });
	bridge.api.getInitiatedWaves = vi.fn().mockResolvedValue({ ok: true, data: { waves: [] } });
});

describe("WavesView", () => {
	it("lists received waves and their senders", async () => {
		bridge.api.getReceivedWaves = vi.fn().mockResolvedValue({
			ok: true,
			data: { waves: [{ wave_id: "w1", user_profile: { user_id: 5, name: "Bea", username: "bea" } }] }
		});

		const wrapper = mount(WavesView, { global: { stubs: { AppAvatar: true } } });
		await settle(wrapper);

		expect(wrapper.findAll(".wave")).toHaveLength(1);
		expect(wrapper.text()).toContain("Bea");
	});

	it("waves back, sending the wave and user ids", async () => {
		bridge.api.getReceivedWaves = vi.fn().mockResolvedValue({
			ok: true,
			data: { waves: [{ wave_id: "w1", user_profile: { user_id: 5, name: "Bea" } }] }
		});
		bridge.api.acceptWave = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });

		const wrapper = mount(WavesView, { global: { stubs: { AppAvatar: true } } });
		await settle(wrapper);

		await wrapper.find(".wave .btn").trigger("click");
		await settle(wrapper);

		expect(bridge.api.acceptWave).toHaveBeenCalledWith({ userId: 5, waveId: "w1", source: "WAVE" });
		// Accepted waves leave the received list.
		expect(wrapper.findAll(".wave")).toHaveLength(0);
	});

	it("joins the room a wave-back returns", async () => {
		bridge.api.getReceivedWaves = vi.fn().mockResolvedValue({
			ok: true,
			data: { waves: [{ wave_id: "w1", user_profile: { user_id: 5, name: "Bea" } }] }
		});
		bridge.api.acceptWave = vi.fn().mockResolvedValue({ ok: true, data: { success: true, channel: "R1" } });

		const wrapper = mount(WavesView, { global: { stubs: { AppAvatar: true } } });
		await settle(wrapper);

		await wrapper.find(".wave .btn").trigger("click");
		await settle(wrapper);

		expect(push).toHaveBeenCalledWith({ name: "room", params: { channel: "R1" } });
	});

	it("reads the sender across the fields a wave might use", async () => {
		bridge.api.getReceivedWaves = vi.fn().mockResolvedValue({
			ok: true,
			data: { waves: [{ id: "w2", from_user_profile: { user_id: 9, name: "Cy" } }] }
		});

		const wrapper = mount(WavesView, { global: { stubs: { AppAvatar: true } } });
		await settle(wrapper);

		expect(wrapper.text()).toContain("Cy");
	});

	it("says plainly when there are none", async () => {
		const wrapper = mount(WavesView, { global: { stubs: { AppAvatar: true } } });
		await settle(wrapper);

		expect(wrapper.text()).toContain("No waves waiting.");
	});
});
