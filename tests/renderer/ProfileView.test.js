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
	// /me answers with a stub of a profile: an id, a name, a handle, a picture
	// and a share link. No bio, no counts, no houses, no follow status.
	bridge.api.me = vi.fn().mockResolvedValue({
		ok: true,
		data: {
			following_ids: [],
			blocked_ids: [],
			user_profile: { user_id: 7, name: "Me", username: "me", photo_url: null }
		}
	});
	bridge.api.follow = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
	bridge.api.unfollow = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
	bridge.api.block = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
	bridge.api.unblock = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
	bridge.api.sendWave = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });
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

	it("shows Requested, not Following, for a pending request", async () => {
		// A protected account you have asked to follow: follow_status names the
		// pending state, and it must not read as an accepted follow whose
		// button would unfollow.
		bridge.api.getProfile = vi.fn().mockResolvedValue({
			ok: true,
			data: { user_profile: theirProfile({ follow_status: "follow_requested" }) }
		});

		const wrapper = mountProfile();
		await settle(wrapper);

		expect(wrapper.find(".profile__actions button").text()).toBe("Requested");
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

	// Located by text, not position, so the wave button between Follow and
	// Block does not renumber these.
	const buttonBy = (wrapper, re) => wrapper.findAll(".profile__actions button").find(b => re.test(b.text()));

	it("asks before blocking, and does not block on the first click", async () => {
		const wrapper = mountProfile();
		await settle(wrapper);

		await buttonBy(wrapper, /Block/).trigger("click");
		expect(bridge.api.block).not.toHaveBeenCalled();
		expect(buttonBy(wrapper, /Really block/).exists()).toBe(true);

		await buttonBy(wrapper, /Really block/).trigger("click");
		expect(bridge.api.block).toHaveBeenCalledWith(THEM);
	});

	it("lets the confirmation be cancelled", async () => {
		const wrapper = mountProfile();
		await settle(wrapper);

		await buttonBy(wrapper, /Block/).trigger("click");
		await buttonBy(wrapper, /Cancel/).trigger("click");

		expect(bridge.api.block).not.toHaveBeenCalled();
		expect(buttonBy(wrapper, /^Block$/).exists()).toBe(true);
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

	it("waves at someone, then shows it was sent", async () => {
		const wrapper = mountProfile();
		await settle(wrapper);

		const waveBtn = wrapper.findAll(".profile__actions button").find(b => /Wave/.test(b.text()));
		expect(waveBtn.text()).toContain("Wave");

		await waveBtn.trigger("click");
		await settle(wrapper);

		expect(bridge.api.sendWave).toHaveBeenCalledWith(THEM);
		expect(wrapper.findAll(".profile__actions button").find(b => /Waved/.test(b.text()))).toBeTruthy();
	});

	it("offers no wave on your own profile", async () => {
		const wrapper = mountProfile("me");
		await settle(wrapper);

		expect(wrapper.findAll(".profile__actions button").some(b => /Wave/.test(b.text()))).toBe(false);
	});

	it("offers no follow or block buttons on your own profile", async () => {
		const wrapper = mountProfile("me");
		await settle(wrapper);

		expect(bridge.api.me).toHaveBeenCalled();
		expect(wrapper.findAll(".profile__actions button")).toHaveLength(0);
	});
});

describe("your own profile", () => {
	const mine = () =>
		theirProfile({ user_id: 7, name: "Me", username: "me", num_followers: 412, num_following: 380 });

	it("goes through get_profile rather than believing /me's stub", async () => {
		// Read straight from /me it rendered a name above zero followers, zero
		// following, no bio and no houses - an empty-looking account rather than
		// a thin response.
		bridge.api.getProfile = vi.fn().mockResolvedValue({ ok: true, data: { user_profile: mine() } });

		const wrapper = mountProfile("me");
		await settle(wrapper);

		expect(bridge.api.getProfile).toHaveBeenCalledWith(7);
		expect(wrapper.text()).toContain("412");
		expect(wrapper.text()).toContain("380");
		expect(wrapper.text()).toContain("For it is not in knowing much");
	});

	it("does not wait for /me when the id is already known", async () => {
		bridge.api.getProfile = vi.fn().mockResolvedValue({ ok: true, data: { user_profile: mine() } });

		const wrapper = mountProfile(7);
		await settle(wrapper);

		expect(bridge.api.getProfile).toHaveBeenCalledTimes(1);
		expect(bridge.api.getProfile).toHaveBeenCalledWith(7);
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
