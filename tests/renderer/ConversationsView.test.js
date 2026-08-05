import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ConversationsView from "@/views/ConversationsView.vue";
import { stubBridge } from "../setup.js";

const push = vi.fn();
vi.mock("vue-router", () => ({
	useRouter: () => ({ push }),
	RouterLink: { props: ["to"], template: "<a><slot /></a>" }
}));

let bridge;

const convo = (id, extra = {}) => ({
	conversation_id: id,
	title: `Thread ${id}`,
	time_content_updated: "2026-08-05T11:00:00Z",
	creator_user_profile: { user_id: 1, name: "Paul", username: "paul" },
	preview_segment_text: "last thing said",
	has_new_segments: false,
	is_archived: false,
	...extra
});

function mountView() {
	return mount(ConversationsView, { global: { stubs: { RouterLink: true } } });
}

const settle = async wrapper => {
	await new Promise(resolve => setTimeout(resolve, 0));
	await wrapper.vm.$nextTick();
};

beforeEach(() => {
	push.mockClear();
	bridge = stubBridge();
	bridge.api.getConversations = vi.fn().mockResolvedValue({
		ok: true,
		data: { success: true, conversations: [convo("a"), convo("b")], next_cursor: null }
	});
});

describe("ConversationsView", () => {
	it("lists conversations with their titles and previews", async () => {
		const wrapper = mountView();
		await settle(wrapper);

		expect(wrapper.findAll(".convo")).toHaveLength(2);
		expect(wrapper.text()).toContain("Thread a");
		expect(wrapper.text()).toContain("last thing said");
	});

	it("hides archived threads until asked", async () => {
		bridge.api.getConversations = vi.fn().mockResolvedValue({
			ok: true,
			data: { conversations: [convo("a"), convo("z", { is_archived: true })], next_cursor: null }
		});

		const wrapper = mountView();
		await settle(wrapper);
		expect(wrapper.findAll(".convo")).toHaveLength(1);

		await wrapper.find(".page__archived input").setValue(true);
		expect(wrapper.findAll(".convo")).toHaveLength(2);
	});

	it("describes a voice reply that carries no text", async () => {
		bridge.api.getConversations = vi.fn().mockResolvedValue({
			ok: true,
			data: {
				conversations: [convo("a", { preview_segment_text: undefined, preview_segment_type: "VOICE_REPLY" })],
				next_cursor: null
			}
		});

		const wrapper = mountView();
		await settle(wrapper);

		expect(wrapper.text()).toContain("Voice reply");
	});

	it("marks a thread with new segments", async () => {
		bridge.api.getConversations = vi.fn().mockResolvedValue({
			ok: true,
			data: { conversations: [convo("a", { has_new_segments: true })], next_cursor: null }
		});

		const wrapper = mountView();
		await settle(wrapper);

		expect(wrapper.find(".convo--new").exists()).toBe(true);
		expect(wrapper.find(".convo__dot").exists()).toBe(true);
	});

	it("opens a thread on click", async () => {
		const wrapper = mountView();
		await settle(wrapper);

		await wrapper.find(".convo").trigger("click");

		expect(push).toHaveBeenCalledWith({ name: "conversation", params: { id: "a" } });
	});

	it("pages with the cursor and does not duplicate", async () => {
		bridge.api.getConversations = vi.fn().mockResolvedValue({
			ok: true,
			data: { conversations: [convo("a")], next_cursor: "CUR" }
		});

		const wrapper = mountView();
		await settle(wrapper);
		expect(wrapper.find(".load-more").exists()).toBe(true);

		bridge.api.getConversations = vi.fn().mockResolvedValue({
			ok: true,
			data: { conversations: [convo("a"), convo("c")], next_cursor: null }
		});

		await wrapper.find(".load-more").trigger("click");
		await settle(wrapper);

		expect(bridge.api.getConversations).toHaveBeenCalledWith({ cursor: "CUR" });
		expect(wrapper.findAll(".convo")).toHaveLength(2);
		expect(wrapper.find(".load-more").exists()).toBe(false);
	});

	it("says so plainly when there are none", async () => {
		bridge.api.getConversations = vi.fn().mockResolvedValue({ ok: true, data: { conversations: [] } });

		const wrapper = mountView();
		await settle(wrapper);

		expect(wrapper.text()).toContain("No conversations.");
	});
});
