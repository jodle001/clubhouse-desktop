import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ConversationView from "@/views/ConversationView.vue";
import { stubBridge } from "../setup.js";

vi.mock("vue-router", () => ({
	RouterLink: { props: ["to"], template: "<a><slot /></a>" }
}));

const RouterLinkStub = { props: ["to"], template: "<a><slot /></a>" };

let bridge;

const segment = (extra = {}) => ({
	segment_id: `s${Math.round(extra.n ?? 0)}`,
	creator_user_profile: { user_id: 1, name: "John", username: "john" },
	time_created: "2026-08-05T11:00:00Z",
	user_text: "hello everyone",
	shared_without_voice: true,
	photo_url: null,
	segment_audio_url: "https://example.invalid/silence.m4a",
	...extra
});

function conversation(segments) {
	return {
		conversation_id: "abc",
		title: "John's House",
		summary: "A summary of the thread.",
		creator_user_profile: { user_id: 1, name: "John", username: "john" },
		time_created: "2025-01-01T00:00:00Z",
		share_url: "https://www.clubhouse.com/convo/abc",
		segments,
		success: true
	};
}

function mountView() {
	return mount(ConversationView, {
		props: { id: "abc" },
		global: { stubs: { RouterLink: RouterLinkStub } }
	});
}

const settle = async wrapper => {
	await new Promise(resolve => setTimeout(resolve, 0));
	await wrapper.vm.$nextTick();
};

beforeEach(() => {
	bridge = stubBridge();
	bridge.api.getConversation = vi
		.fn()
		.mockResolvedValue({ ok: true, data: conversation([segment({ n: 1 })]) });
});

describe("ConversationView", () => {
	it("shows the thread's title and summary", async () => {
		const wrapper = mountView();
		await settle(wrapper);

		expect(bridge.api.getConversation).toHaveBeenCalledWith("abc");
		expect(wrapper.text()).toContain("John's House");
		expect(wrapper.text()).toContain("A summary of the thread.");
	});

	it("renders each segment's text from user_text", async () => {
		bridge.api.getConversation = vi.fn().mockResolvedValue({
			ok: true,
			data: conversation([
				segment({ n: 1, user_text: "first post" }),
				segment({ n: 2, user_text: "second post" })
			])
		});

		const wrapper = mountView();
		await settle(wrapper);

		expect(wrapper.findAll(".segment")).toHaveLength(2);
		expect(wrapper.text()).toContain("first post");
		expect(wrapper.text()).toContain("second post");
	});

	it("shows a photo attachment", async () => {
		bridge.api.getConversation = vi.fn().mockResolvedValue({
			ok: true,
			data: conversation([segment({ n: 1, user_text: "", photo_url: "https://example.invalid/pic.jpg" })])
		});

		const wrapper = mountView();
		await settle(wrapper);

		expect(wrapper.find(".segment__photo").attributes("src")).toBe("https://example.invalid/pic.jpg");
	});

	it("offers a player only for a real voice recording", async () => {
		bridge.api.getConversation = vi.fn().mockResolvedValue({
			ok: true,
			data: conversation([
				// A text post reuses a silent placeholder - no player.
				segment({ n: 1, shared_without_voice: true }),
				// A genuine voice note - player.
				segment({ n: 2, user_text: "", shared_without_voice: false })
			])
		});

		const wrapper = mountView();
		await settle(wrapper);

		expect(wrapper.findAll(".segment__audio")).toHaveLength(1);
	});

	it("says so plainly when the thread is empty", async () => {
		bridge.api.getConversation = vi.fn().mockResolvedValue({ ok: true, data: conversation([]) });

		const wrapper = mountView();
		await settle(wrapper);

		expect(wrapper.text()).toContain("Nothing has been said here yet.");
	});

	it("marks the thread read when opened", async () => {
		bridge.api.markConversationRead = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });

		const wrapper = mountView();
		await settle(wrapper);

		expect(bridge.api.markConversationRead).toHaveBeenCalledWith("abc");
	});

	it("posts a reply and reloads the thread", async () => {
		bridge.api.sendConversationSegment = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });

		const wrapper = mountView();
		await settle(wrapper);

		await wrapper.find(".reply__input").setValue("well said");
		await wrapper.find(".reply").trigger("submit");
		await settle(wrapper);

		expect(bridge.api.sendConversationSegment).toHaveBeenCalledWith({ conversationId: "abc", text: "well said" });
		// Reloaded after posting: getConversation called on mount and again after.
		expect(bridge.api.getConversation).toHaveBeenCalledTimes(2);
	});

	it("retires the composer when replying is version-gated", async () => {
		bridge.api.sendConversationSegment = vi.fn().mockResolvedValue({
			ok: false,
			error: { message: "Please upgrade your app to use new chat", status: 400 }
		});

		const wrapper = mountView();
		await settle(wrapper);

		await wrapper.find(".reply__input").setValue("hi");
		await wrapper.find(".reply").trigger("submit");
		await settle(wrapper);

		expect(wrapper.find(".reply").exists()).toBe(false);
		expect(wrapper.text()).toMatch(/read-only here/);
	});
});
