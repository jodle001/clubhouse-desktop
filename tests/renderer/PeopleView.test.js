import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import PeopleView from "@/views/PeopleView.vue";
import { stubBridge } from "../setup.js";

vi.mock("vue-router", () => ({
	RouterLink: { props: ["to"], template: "<a><slot /></a>" }
}));

const RouterLinkStub = { props: ["to"], template: "<a><slot /></a>" };

let bridge;

const person = (id, extra = {}) => ({
	user_id: id,
	name: `User ${id}`,
	username: `u${id}`,
	...extra
});

function mountPeople() {
	return mount(PeopleView, { global: { stubs: { RouterLink: RouterLinkStub } } });
}

const settle = async wrapper => {
	await new Promise(resolve => setTimeout(resolve, 0));
	await wrapper.vm.$nextTick();
};

beforeEach(() => {
	bridge = stubBridge();
	bridge.api.getSuggestedFollows = vi.fn().mockResolvedValue({
		ok: true,
		data: { users: [person(1), person(2)], next: "/x?page=2", count: 40 }
	});
	bridge.api.follow = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
	bridge.api.unfollow = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
});

describe("PeopleView", () => {
	it("lists the first page of suggestions", async () => {
		const wrapper = mountPeople();
		await settle(wrapper);

		expect(bridge.api.getSuggestedFollows).toHaveBeenCalledWith({ page: 1 });
		expect(wrapper.text()).toContain("User 1");
		expect(wrapper.text()).toContain("User 2");
	});

	it("follows somebody and flips the button", async () => {
		const wrapper = mountPeople();
		await settle(wrapper);

		const first = wrapper.findAll(".user-row button")[0];
		expect(first.text()).toBe("Follow");

		await first.trigger("click");
		await settle(wrapper);

		expect(bridge.api.follow).toHaveBeenCalledWith(1);
		expect(wrapper.findAll(".user-row button")[0].text()).toBe("Following");
	});

	it("shows Following for somebody already followed", async () => {
		bridge.api.getSuggestedFollows = vi.fn().mockResolvedValue({
			ok: true,
			data: { users: [person(1, { follow_status: "following" })], next: null }
		});

		const wrapper = mountPeople();
		await settle(wrapper);

		expect(wrapper.find(".user-row button").text()).toBe("Following");
	});

	it("loads the next page and appends without duplicating", async () => {
		const wrapper = mountPeople();
		await settle(wrapper);

		bridge.api.getSuggestedFollows = vi.fn().mockResolvedValue({
			ok: true,
			// Overlap with page one: user 2 must not appear twice.
			data: { users: [person(2), person(3)], next: null }
		});

		await wrapper.find(".load-more").trigger("click");
		await settle(wrapper);

		expect(bridge.api.getSuggestedFollows).toHaveBeenCalledWith({ page: 2 });
		expect(wrapper.findAll(".user-row")).toHaveLength(3);
		expect(wrapper.text()).toContain("User 3");
	});

	it("stops offering more when a page reports no next", async () => {
		bridge.api.getSuggestedFollows = vi.fn().mockResolvedValue({
			ok: true,
			data: { users: [person(1)], next: null, next_sequence: null }
		});

		const wrapper = mountPeople();
		await settle(wrapper);

		expect(wrapper.find(".load-more").exists()).toBe(false);
	});

	it("says so plainly when there are no suggestions", async () => {
		bridge.api.getSuggestedFollows = vi.fn().mockResolvedValue({ ok: true, data: { users: [] } });

		const wrapper = mountPeople();
		await settle(wrapper);

		expect(wrapper.text()).toContain("No suggestions right now.");
	});
});
