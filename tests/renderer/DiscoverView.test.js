import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DiscoverView from "@/views/DiscoverView.vue";
import { stubBridge } from "../setup.js";

let bridge;

const settle = async wrapper => {
	await new Promise(resolve => setTimeout(resolve, 0));
	await wrapper.vm.$nextTick();
};

function mountView() {
	return mount(DiscoverView, { global: { stubs: { RouterLink: { props: ["to"], template: "<a><slot /></a>" } } } });
}

beforeEach(() => {
	bridge = stubBridge();
});

describe("DiscoverView", () => {
	it("renders collections of houses from the feed", async () => {
		bridge.api.getDiscoveryFeed = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				items: [
					{
						social_club_collection: {
							title: "Popular houses",
							items: [
								{ social_club_id: 1, name: "C.A.M.P", num_members: 227 },
								{ social_club_id: 2, name: "Book Club", num_members: 40 }
							]
						}
					}
				]
			}
		});

		const wrapper = mountView();
		await settle(wrapper);

		expect(wrapper.find(".collection__title").text()).toBe("Popular houses");
		expect(wrapper.findAll(".house")).toHaveLength(2);
		expect(wrapper.text()).toContain("C.A.M.P");
		expect(wrapper.text()).toContain("227 members");
	});

	it("reads clubs nested under social_club, and links by id", async () => {
		bridge.api.getDiscoveryFeed = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				items: [
					{
						social_club_collection: {
							title: "For you",
							items: [{ social_club: { club_id: 9, name: "Design" } }]
						}
					}
				]
			}
		});

		const wrapper = mountView();
		await settle(wrapper);

		expect(wrapper.text()).toContain("Design");
		// A club with an id renders as a link (the RouterLink stub is an <a>).
		expect(wrapper.find(".house").element.tagName).toBe("A");
	});

	it("still renders a club with no id, just without a link", async () => {
		bridge.api.getDiscoveryFeed = vi.fn().mockResolvedValue({
			ok: true,
			data: { items: [{ social_club_collection: { title: "x", items: [{ name: "Nameless" }] } }] }
		});

		const wrapper = mountView();
		await settle(wrapper);

		expect(wrapper.find(".house").element.tagName).toBe("DIV");
		expect(wrapper.text()).toContain("Nameless");
	});

	it("drops empty collections and says so when there is nothing", async () => {
		bridge.api.getDiscoveryFeed = vi.fn().mockResolvedValue({
			ok: true,
			data: { items: [{ social_club_collection: { title: "empty", items: [] } }] }
		});

		const wrapper = mountView();
		await settle(wrapper);

		expect(wrapper.findAll(".collection")).toHaveLength(0);
		expect(wrapper.text()).toContain("Nothing to discover right now.");
	});
});
