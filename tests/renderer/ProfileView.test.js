import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ProfileView from "@/views/ProfileView.vue";
import { stubBridge } from "../setup.js";
import { sessionState } from "@/composables/useSession.js";

vi.mock("vue-router", () => ({
	useRouter: () => ({ push: vi.fn() }),
	useRoute: () => ({}),
	RouterLink: { props: ["to"], template: "<a><slot /></a>" }
}));

const THEM = 252870946;

/** Trimmed from a real /get_profile response. */
const theirProfile = (overrides = {}) => ({
	user_id: THEM,
	name: "Haley René",
	username: "haley126",
	bio: "For it is not in knowing much",
	num_followers: 1011,
	num_following: 910,
	num_cofollows: 653,
	time_created: "2021-04-26T18:03:18.732494+00:00",
	follows_me: false,
	follow_status: "not_following",
	mutual_follows_count: 23,
	mutual_follows: [
		{ user_id: 1, name: "Andrew R", username: "andrewr31" },
		{ user_id: 2, name: "Bob", username: "bob" }
	],
	social_clubs: [{ social_club_id: 1, name: "C.A.M.P ⛺" }],
	social_clubs_count: 227,
	clubs_details_title: "Haley's clubs",
	has_protected_profile: false,
	invited_by_user_profile: { user_id: 99, name: "Tarun Gaur", username: "tarungaur" },
	...overrides
});

let bridge;

// Renders its slot, unlike `stubs: { RouterLink: true }`, so linked names are
// still in the output.
const RouterLinkStub = { props: ["to"], template: "<a><slot /></a>" };

function mountProfile(id = THEM) {
	return mount(ProfileView, { props: { id }, global: { stubs: { RouterLink: RouterLinkStub } } });
}

const settle = async wrapper => {
	await new Promise(resolve => setTimeout(resolve, 0));
	await wrapper.vm.$nextTick();
};

beforeEach(() => {
	sessionState.settings = {};
	sessionState.user = { user_profile: { user_id: 7 } };

	bridge = stubBridge();
	bridge.api.getProfile = vi.fn().mockResolvedValue({ ok: true, data: { user_profile: theirProfile() } });
	bridge.api.me = vi
		.fn()
		.mockResolvedValue({ ok: true, data: { following_ids: [], blocked_ids: [], user_profile: {} } });
	bridge.api.follow = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
	bridge.api.unfollow = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
	bridge.api.block = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
	bridge.api.unblock = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
});

describe("ProfileView", () => {
	it("shows the things the phone app shows", async () => {
		const wrapper = mountProfile();
		await settle(wrapper);

		const text = wrapper.text();
		expect(text).toContain("Haley René");
		expect(text).toContain("@haley126");
		expect(text).toContain("1011");
		expect(text).toContain("653");
		expect(text).toContain("C.A.M.P ⛺");
		expect(text).toContain("Tarun Gaur");
		expect(text).toMatch(/Joined \w+ 2021/);
	});

	it("summarises mutual follows rather than listing 23 people", async () => {
		const wrapper = mountProfile();
		await settle(wrapper);

		expect(wrapper.text()).toContain("Andrew R");
		expect(wrapper.text()).toMatch(/21 others you follow/);
	});

	it("trusts follow_status over anything inferred", async () => {
		bridge.api.getProfile = vi.fn().mockResolvedValue({
			ok: true,
			data: { user_profile: theirProfile({ follow_status: "following" }) }
		});
		// /me disagrees; the profile's own answer should win.
		bridge.api.me = vi
			.fn()
			.mockResolvedValue({ ok: true, data: { following_ids: [], blocked_ids: [] } });

		const wrapper = mountProfile();
		await settle(wrapper);

		expect(wrapper.find(".profile__actions button").text()).toBe("Following");
	});

	it("falls back to following_ids when follow_status is absent", async () => {
		const withoutStatus = theirProfile();
		delete withoutStatus.follow_status;

		bridge.api.getProfile = vi.fn().mockResolvedValue({ ok: true, data: { user_profile: withoutStatus } });
		bridge.api.me = vi
			.fn()
			.mockResolvedValue({ ok: true, data: { following_ids: [THEM], blocked_ids: [] } });

		const wrapper = mountProfile();
		await settle(wrapper);

		expect(wrapper.find(".profile__actions button").text()).toBe("Following");
	});

	it("says when someone follows you", async () => {
		bridge.api.getProfile = vi.fn().mockResolvedValue({
			ok: true,
			data: { user_profile: theirProfile({ follows_me: true }) }
		});

		const wrapper = mountProfile();
		await settle(wrapper);

		expect(wrapper.find(".profile__badge").text()).toBe("Follows you");
	});

	it("explains that a private profile needs approval", async () => {
		bridge.api.getProfile = vi.fn().mockResolvedValue({
			ok: true,
			data: { user_profile: theirProfile({ has_protected_profile: true }) }
		});

		const wrapper = mountProfile();
		await settle(wrapper);

		expect(wrapper.text()).toMatch(/needs their approval/);
	});

	it("asks before blocking, and does not block on the first click", async () => {
		const wrapper = mountProfile();
		await settle(wrapper);

		const blockButton = () => wrapper.findAll(".profile__actions button")[1];

		await blockButton().trigger("click");
		expect(bridge.api.block).not.toHaveBeenCalled();
		expect(blockButton().text()).toBe("Really block?");

		await blockButton().trigger("click");
		expect(bridge.api.block).toHaveBeenCalledWith(THEM);
	});

	it("lets the confirmation be cancelled", async () => {
		const wrapper = mountProfile();
		await settle(wrapper);

		await wrapper.findAll(".profile__actions button")[1].trigger("click");
		await wrapper.findAll(".profile__actions button")[2].trigger("click");

		expect(bridge.api.block).not.toHaveBeenCalled();
		expect(wrapper.findAll(".profile__actions button")[1].text()).toBe("Block");
	});

	it("unblocks without asking, since that harms nobody", async () => {
		bridge.api.me = vi
			.fn()
			.mockResolvedValue({ ok: true, data: { following_ids: [], blocked_ids: [THEM] } });

		const wrapper = mountProfile();
		await settle(wrapper);

		const blockButton = wrapper.findAll(".profile__actions button")[1];
		expect(blockButton.text()).toBe("Unblock");

		await blockButton.trigger("click");
		expect(bridge.api.unblock).toHaveBeenCalledWith(THEM);
	});

	it("will not offer to follow somebody you have blocked", async () => {
		bridge.api.me = vi
			.fn()
			.mockResolvedValue({ ok: true, data: { following_ids: [], blocked_ids: [THEM] } });

		const wrapper = mountProfile();
		await settle(wrapper);

		expect(wrapper.findAll(".profile__actions button")[0].attributes("disabled")).toBeDefined();
	});

	it("offers no follow or block buttons on your own profile", async () => {
		const wrapper = mountProfile("me");
		await settle(wrapper);

		expect(bridge.api.me).toHaveBeenCalled();
		expect(wrapper.findAll(".profile__actions button")).toHaveLength(0);
	});
});

describe("mutual follows", () => {
	it("expands the full list on demand, and collapses again", async () => {
		bridge.api.getMutualFollows = vi.fn().mockResolvedValue({
			ok: true,
			data: { users: [{ user_id: 11, name: "Carol", username: "carol" }] }
		});

		const wrapper = mountProfile();
		await settle(wrapper);

		// Not fetched until asked - 23 mutuals is a request nobody needed yet.
		expect(bridge.api.getMutualFollows).not.toHaveBeenCalled();

		await wrapper.find(".profile__mutual").trigger("click");
		await settle(wrapper);

		expect(bridge.api.getMutualFollows).toHaveBeenCalledWith(THEM);
		expect(wrapper.find(".profile__mutual-list").text()).toContain("Carol");

		await wrapper.find(".profile__mutual").trigger("click");
		expect(wrapper.find(".profile__mutual-list").exists()).toBe(false);
	});

	it("says plainly when there is nobody in common", async () => {
		bridge.api.getMutualFollows = vi.fn().mockResolvedValue({ ok: true, data: { users: [] } });

		const wrapper = mountProfile();
		await settle(wrapper);
		await wrapper.find(".profile__mutual").trigger("click");
		await settle(wrapper);

		expect(wrapper.text()).toContain("Nobody in common.");
	});
});
