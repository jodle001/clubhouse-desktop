import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import NotificationsView from "@/views/NotificationsView.vue";
import { useActivity } from "@/composables/useActivity.js";
import { stubBridge } from "../setup.js";

let bridge;

const activity = (title, { unread = false, avatar } = {}) => ({
	is_unread: unread,
	details: [{ title, avatar: avatar || { image_url: "https://example.invalid/a.png" } }],
	logging_context: { entity_id: 1 }
});

const settle = async wrapper => {
	await new Promise(resolve => setTimeout(resolve, 0));
	await wrapper.vm.$nextTick();
};

beforeEach(() => {
	bridge = stubBridge();
	// Reset the module singleton between tests.
	const a = useActivity();
	a.activities.value = [];
	a.cursor.value = null;
	a.loaded.value = false;
	a.error.value = "";
});

describe("NotificationsView", () => {
	it("lists activities with their titles", async () => {
		bridge.api.getActivities = vi.fn().mockResolvedValue({
			ok: true,
			data: { activities: [activity("Bea started following you"), activity("You were invited up")], next_cursor: null }
		});

		const wrapper = mount(NotificationsView, { global: { stubs: { RouterLink: true } } });
		await settle(wrapper);

		expect(wrapper.findAll(".act")).toHaveLength(2);
		expect(wrapper.text()).toContain("Bea started following you");
	});

	it("marks the unread ones", async () => {
		bridge.api.getActivities = vi.fn().mockResolvedValue({
			ok: true,
			data: { activities: [activity("New", { unread: true }), activity("Old")], next_cursor: null }
		});

		const wrapper = mount(NotificationsView, { global: { stubs: { RouterLink: true } } });
		await settle(wrapper);

		expect(wrapper.findAll(".act--unread")).toHaveLength(1);
		expect(wrapper.find(".act__dot").exists()).toBe(true);
	});

	it("falls back to an initial when an avatar has no image", async () => {
		bridge.api.getActivities = vi.fn().mockResolvedValue({
			ok: true,
			data: { activities: [activity("Zoe waved", { avatar: {} })], next_cursor: null }
		});

		const wrapper = mount(NotificationsView, { global: { stubs: { RouterLink: true } } });
		await settle(wrapper);

		expect(wrapper.find(".act__fallback").text()).toBe("Z");
	});

	it("pages with the cursor", async () => {
		bridge.api.getActivities = vi.fn().mockResolvedValue({
			ok: true,
			data: { activities: [activity("One")], next_cursor: "CUR" }
		});

		const wrapper = mount(NotificationsView, { global: { stubs: { RouterLink: true } } });
		await settle(wrapper);
		expect(wrapper.find(".load-more").exists()).toBe(true);

		bridge.api.getActivities = vi.fn().mockResolvedValue({
			ok: true,
			data: { activities: [activity("Two")], next_cursor: null }
		});

		await wrapper.find(".load-more").trigger("click");
		await settle(wrapper);

		expect(bridge.api.getActivities).toHaveBeenCalledWith({ cursor: "CUR" });
		expect(wrapper.findAll(".act")).toHaveLength(2);
		expect(wrapper.find(".load-more").exists()).toBe(false);
	});

	it("says so plainly when there is nothing", async () => {
		bridge.api.getActivities = vi.fn().mockResolvedValue({ ok: true, data: { activities: [] } });

		const wrapper = mount(NotificationsView, { global: { stubs: { RouterLink: true } } });
		await settle(wrapper);

		expect(wrapper.text()).toContain("Nothing new.");
	});

	it("counts the unread for the nav bell", async () => {
		bridge.api.getActivities = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				activities: [activity("a", { unread: true }), activity("b", { unread: true }), activity("c")],
				next_cursor: null
			}
		});

		const a = useActivity();
		await a.load();

		expect(a.unreadCount.value).toBe(2);
	});
});
