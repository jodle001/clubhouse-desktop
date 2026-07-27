import { describe, expect, it, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import LoginView from "@/views/LoginView.vue";
import { stubBridge } from "../setup.js";

const stubs = { RouterLink: true };
const push = vi.fn();
vi.mock("vue-router", () => ({ useRouter: () => ({ push }), useRoute: () => ({ query: {} }) }));

function mountLogin() {
	return mount(LoginView, { global: { stubs } });
}

describe("LoginView", () => {
	beforeEach(() => {
		push.mockClear();
		stubBridge();
	});

	it("defaults to the United States", () => {
		expect(mountLogin().find("select").element.value).toBe("US");
	});

	it("previews what will actually be sent", async () => {
		const wrapper = mountLogin();
		await wrapper.find("input[type=tel]").setValue("5551234567");
		expect(wrapper.text()).toContain("+15551234567");
	});

	it("refuses a short number without calling the API", async () => {
		const bridge = stubBridge();
		bridge.api.startPhoneAuth = vi.fn();

		const wrapper = mountLogin();
		await wrapper.find("input[type=tel]").setValue("5555555");
		await wrapper.find("button").trigger("click");

		expect(bridge.api.startPhoneAuth).not.toHaveBeenCalled();
		expect(wrapper.find(".error-box").text()).toMatch(/10 digits/);
	});

	it("sends E.164 and advances to verify on success", async () => {
		const bridge = stubBridge();
		bridge.api.startPhoneAuth = vi.fn().mockResolvedValue({ ok: true, data: { success: true } });

		const wrapper = mountLogin();
		await wrapper.find("input[type=tel]").setValue("(555) 123-4567");
		await wrapper.find("button").trigger("click");
		await new Promise(r => setTimeout(r, 0));

		expect(bridge.api.startPhoneAuth).toHaveBeenCalledWith("+15551234567");
		expect(push).toHaveBeenCalledWith({ name: "verify", query: { phone: "+15551234567" } });
	});

	it("stays put when Clubhouse reports the number as blocked", async () => {
		const bridge = stubBridge();
		bridge.api.startPhoneAuth = vi
			.fn()
			.mockResolvedValue({ ok: true, data: { success: true, is_blocked: true } });

		const wrapper = mountLogin();
		await wrapper.find("input[type=tel]").setValue("5551234567");
		await wrapper.find("button").trigger("click");
		await new Promise(r => setTimeout(r, 0));

		expect(push).not.toHaveBeenCalled();
		expect(wrapper.find(".error-box").text()).toMatch(/not sending a code/i);
	});

	it("shows the API's own message when sign-in is refused", async () => {
		const bridge = stubBridge();
		bridge.api.startPhoneAuth = vi
			.fn()
			.mockResolvedValue({ ok: true, data: { success: false, error_message: "nope" } });

		const wrapper = mountLogin();
		await wrapper.find("input[type=tel]").setValue("5551234567");
		await wrapper.find("button").trigger("click");
		await new Promise(r => setTimeout(r, 0));

		expect(wrapper.find(".error-box").text()).toBe("nope");
		expect(push).not.toHaveBeenCalled();
	});
});
