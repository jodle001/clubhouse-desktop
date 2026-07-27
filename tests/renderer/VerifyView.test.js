import { describe, expect, it, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import VerifyView from "@/views/VerifyView.vue";
import { stubBridge } from "../setup.js";

const replace = vi.fn();
vi.mock("vue-router", () => ({
	useRouter: () => ({ replace, push: vi.fn() }),
	useRoute: () => ({ query: { phone: "+15551234567" } })
}));

const stubs = { RouterLink: true };
const flush = () => new Promise(r => setTimeout(r, 0));

describe("VerifyView", () => {
	beforeEach(() => {
		replace.mockClear();
		stubBridge();
	});

	it("sends a 6 digit code - the case the old client silently ignored", async () => {
		const bridge = stubBridge();
		bridge.api.completePhoneAuth = vi.fn().mockResolvedValue({
			ok: true,
			data: { success: true, is_verified: true, user_profile: { username: "ada" } }
		});

		const wrapper = mount(VerifyView, { global: { stubs } });
		await wrapper.find("input").setValue("123456");
		await wrapper.findAll("button")[0].trigger("click");
		await flush();

		expect(bridge.api.completePhoneAuth).toHaveBeenCalledWith("+15551234567", "123456");
		expect(replace).toHaveBeenCalledWith({ name: "home" });
	});

	it("refuses a too-short code without calling the API", async () => {
		const bridge = stubBridge();
		bridge.api.completePhoneAuth = vi.fn();

		const wrapper = mount(VerifyView, { global: { stubs } });
		await wrapper.find("input").setValue("12");
		await wrapper.findAll("button")[0].trigger("click");
		await flush();

		expect(bridge.api.completePhoneAuth).not.toHaveBeenCalled();
		expect(wrapper.find(".error-box").exists()).toBe(true);
	});

	it("reports a rejected code with attempts remaining", async () => {
		const bridge = stubBridge();
		bridge.api.completePhoneAuth = vi.fn().mockResolvedValue({
			ok: true,
			data: { success: false, number_of_attempts_remaining: 2 }
		});

		const wrapper = mount(VerifyView, { global: { stubs } });
		await wrapper.find("input").setValue("123456");
		await wrapper.findAll("button")[0].trigger("click");
		await flush();

		expect(wrapper.find(".error-box").text()).toMatch(/2 attempt/);
	});

	it("routes a waitlisted account to the waitlist", async () => {
		const bridge = stubBridge();
		bridge.api.completePhoneAuth = vi.fn().mockResolvedValue({
			ok: true,
			data: { success: true, is_verified: true, is_waitlisted: true, user_profile: {} }
		});

		const wrapper = mount(VerifyView, { global: { stubs } });
		await wrapper.find("input").setValue("123456");
		await wrapper.findAll("button")[0].trigger("click");
		await flush();

		expect(replace).toHaveBeenCalledWith({ name: "waitlist" });
	});

	it("sends a user with no username to profile setup", async () => {
		const bridge = stubBridge();
		bridge.api.completePhoneAuth = vi.fn().mockResolvedValue({
			ok: true,
			data: { success: true, is_verified: true, user_profile: { username: "" } }
		});

		const wrapper = mount(VerifyView, { global: { stubs } });
		await wrapper.find("input").setValue("123456");
		await wrapper.findAll("button")[0].trigger("click");
		await flush();

		expect(replace).toHaveBeenCalledWith({ name: "editProfile" });
	});
});
