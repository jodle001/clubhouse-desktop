import { _ as _export_sfc, o as onMounted, c as createElementBlock, u as unref, a as createBlock, b as createBaseVNode, t as toDisplayString, w as withDirectives, e as vModelText, f as withKeys, h as createCommentVNode, n as createVNode, p as withCtx, k as computed, l as useRouter, r as ref, q as resolveComponent, i as useSession, s as useRoute, m as openBlock, g as createTextVNode } from "./index-BhP8XgzU.js";
import { u as useApi, A as AppSpinner } from "./AppSpinner-DLdDc0YF.js";
const _hoisted_1 = { class: "center-screen" };
const _hoisted_2 = {
  key: 1,
  class: "card verify"
};
const _hoisted_3 = { class: "muted verify__sub" };
const _hoisted_4 = {
  key: 0,
  class: "error-box"
};
const _hoisted_5 = { class: "verify__actions" };
const _hoisted_6 = {
  key: 1,
  class: "muted"
};
const _sfc_main = {
  __name: "VerifyView",
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const { signIn } = useSession();
    const { loading, call } = useApi();
    const phone = computed(() => route.query.phone || "");
    const code = ref("");
    const error = ref("");
    const called = ref(false);
    onMounted(() => {
      if (!phone.value) {
        router.replace({ name: "login" });
      }
    });
    async function verify() {
      const digits = String(code.value || "").replace(/\D/g, "");
      if (digits.length < 4 || digits.length > 8) {
        error.value = "Enter the code from the text message.";
        return;
      }
      error.value = "";
      loading.value = true;
      try {
        const result = await call("completePhoneAuth", phone.value, digits);
        if (!result.success) {
          error.value = result.error_message || (result.number_of_attempts_remaining != null ? `That code was not accepted. ${result.number_of_attempts_remaining} attempt(s) left.` : "Verification failed.");
          return;
        }
        await signIn(result);
        if (result.is_waitlisted || !result.is_verified) {
          router.replace({ name: "waitlist" });
        } else if (!result.user_profile?.username) {
          router.replace({ name: "editProfile" });
        } else {
          router.replace({ name: "home" });
        }
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    }
    async function callMe() {
      called.value = true;
      setTimeout(() => called.value = false, 15e3);
      try {
        const result = await call("callPhoneAuth", phone.value);
        if (!result.success) {
          error.value = result.error_message || "Could not place the call.";
        }
      } catch (err) {
        error.value = err.message;
      }
    }
    return (_ctx, _cache) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        unref(loading) ? (openBlock(), createBlock(AppSpinner, { key: 0 })) : (openBlock(), createElementBlock("div", _hoisted_2, [
          _cache[2] || (_cache[2] = createBaseVNode("div", {
            class: "verify__logo",
            "aria-hidden": "true"
          }, "👋", -1)),
          _cache[3] || (_cache[3] = createBaseVNode("h1", null, "Enter your code", -1)),
          createBaseVNode("p", _hoisted_3, "Sent to " + toDisplayString(phone.value), 1),
          withDirectives(createBaseVNode("input", {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => code.value = $event),
            type: "tel",
            inputmode: "numeric",
            autofocus: "",
            placeholder: "123456",
            "aria-label": "Verification code",
            class: "verify__code",
            onKeyup: withKeys(verify, ["enter"])
          }, null, 544), [
            [vModelText, code.value]
          ]),
          error.value ? (openBlock(), createElementBlock("p", _hoisted_4, toDisplayString(error.value), 1)) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_5, [
            createBaseVNode("button", {
              class: "btn",
              onClick: verify
            }, "Verify code"),
            !called.value ? (openBlock(), createElementBlock("button", {
              key: 0,
              class: "btn btn-secondary",
              onClick: callMe
            }, "Call me instead")) : (openBlock(), createElementBlock("span", _hoisted_6, "Calling…"))
          ]),
          createVNode(_component_RouterLink, {
            to: { name: "login" },
            class: "muted verify__back"
          }, {
            default: withCtx(() => [..._cache[1] || (_cache[1] = [
              createTextVNode("Wrong number?", -1)
            ])]),
            _: 1
          })
        ]))
      ]);
    };
  }
};
const VerifyView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5de06139"]]);
export {
  VerifyView as default
};
