import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ProfileSheet from "@/components/ProfileSheet.vue";
import { stubBridge } from "../setup.js";
import { sessionState } from "@/composables/useSession.js";

vi.mock("vue-router", () => ({
	useRouter: () => ({ push: vi.fn() }),
	useRoute: () => ({}),
	RouterLink: { props: ["to"], template: "<a><slot /></a>" }
}));

const THEM = 252870946;

let bridge;

const settle = async wrapper => {
	await new Promise(resolve => setTimeout(resolve, 0));
	await wrapper.vm.$nextTick();
};

beforeEach(() => {
	sessionState.user = { user_profile: { user_id: 7 } };
	bridge = stubBridge();
	bridge.api.getProfile = vi.fn().mockResolvedValue({
		ok: true,
		data: { user_profile: { user_id: THEM, name: "Haley René", username: "haley126" } }
	});
	bridge.api.me = vi.fn().mockResolvedValue({ ok: true, data: { following_ids: [], blocked_ids: [] } });
});

function mountSheet() {
	return mount(ProfileSheet, {
		props: { id: THEM },
		attachTo: document.body,
		global: { stubs: { RouterLink: { props: ["to"], template: "<a><slot /></a>" } } }
	});
}

describe("ProfileSheet", () => {
	it("shows the profile over whatever is behind it", async () => {
		const wrapper = mountSheet();
		await settle(wrapper);

		expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
		expect(wrapper.text()).toContain("Haley René");
	});

	it("closes on the backdrop", async () => {
		const wrapper = mountSheet();
		await settle(wrapper);

		await wrapper.find(".sheet").trigger("click");
		expect(wrapper.emitted("close")).toBeTruthy();
	});

	it("does not close when the profile itself is clicked", async () => {
		// The backdrop closes it, so clicks inside must not bubble out.
		const wrapper = mountSheet();
		await settle(wrapper);

		await wrapper.find(".sheet__body").trigger("click");
		expect(wrapper.emitted("close")).toBeFalsy();
	});

	it("closes on Escape", async () => {
		const wrapper = mountSheet();
		await settle(wrapper);

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
		expect(wrapper.emitted("close")).toBeTruthy();
	});

	it("stops listening for Escape once gone", async () => {
		const wrapper = mountSheet();
		await settle(wrapper);
		wrapper.unmount();

		// Would throw on a destroyed component if the listener outlived it.
		expect(() =>
			window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
		).not.toThrow();
	});

	it("offers no links out, since there is a room underneath", async () => {
		const wrapper = mountSheet();
		await settle(wrapper);

		expect(wrapper.findAll("a")).toHaveLength(0);
	});
});
