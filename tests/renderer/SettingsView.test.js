import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import SettingsView from "@/views/SettingsView.vue";
import { stubBridge } from "../setup.js";
import { sessionState } from "@/composables/useSession.js";

vi.mock("vue-router", () => ({
	useRouter: () => ({ push: vi.fn() }),
	useRoute: () => ({}),
	RouterLink: { props: ["to"], template: "<a><slot /></a>" }
}));

const RouterLinkStub = { props: ["to"], template: "<a><slot /></a>" };

let bridge;

const settle = async wrapper => {
	await new Promise(resolve => setTimeout(resolve, 0));
	await wrapper.vm.$nextTick();
};

function mountSettings() {
	return mount(SettingsView, { global: { stubs: { RouterLink: RouterLinkStub } } });
}

beforeEach(() => {
	sessionState.settings = { audioEnabled: false, filterNonLatinRooms: false, theme: "auto" };
	bridge = stubBridge();
	bridge.api.getBlockedUsers = vi.fn().mockResolvedValue({
		ok: true,
		data: {
			users: [
				{ user_id: 1701575344, name: "Someone", username: "someone" },
				{ user_id: 2, name: "Another", username: "another" }
			],
			count: 2
		}
	});
	bridge.api.unblock = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
});

describe("blocked accounts in Settings", () => {
	it("lists who you have blocked", async () => {
		const wrapper = mountSettings();
		await settle(wrapper);

		expect(bridge.api.getBlockedUsers).toHaveBeenCalled();
		expect(wrapper.text()).toContain("Someone");
		expect(wrapper.text()).toContain("Another");
	});

	it("unblocks and drops the row", async () => {
		const wrapper = mountSettings();
		await settle(wrapper);

		await wrapper.find(".blocked button").trigger("click");
		await settle(wrapper);

		expect(bridge.api.unblock).toHaveBeenCalledWith(1701575344);
		expect(wrapper.text()).not.toContain("Someone");
		expect(wrapper.text()).toContain("Another");
	});

	it("keeps the row when unblocking fails", async () => {
		bridge.api.unblock = vi
			.fn()
			.mockResolvedValue({ ok: false, error: { message: "Nope", status: 400 } });

		const wrapper = mountSettings();
		await settle(wrapper);

		await wrapper.find(".blocked button").trigger("click");
		await settle(wrapper);

		expect(wrapper.text()).toContain("Someone");
	});

	it("says so when nobody is blocked", async () => {
		bridge.api.getBlockedUsers = vi.fn().mockResolvedValue({ ok: true, data: { users: [] } });

		const wrapper = mountSettings();
		await settle(wrapper);

		expect(wrapper.text()).toContain("You have not blocked anybody.");
	});

	it("does not break the rest of Settings when the list fails", async () => {
		bridge.api.getBlockedUsers = vi
			.fn()
			.mockResolvedValue({ ok: false, error: { message: "gone", status: 404 } });

		const wrapper = mountSettings();
		await settle(wrapper);

		expect(wrapper.text()).toContain("Appearance");
		expect(wrapper.text()).toContain("You have not blocked anybody.");
	});
});
