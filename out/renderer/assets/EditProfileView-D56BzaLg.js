import { _ as _export_sfc, o as onMounted, c as createElementBlock, b as createBaseVNode, u as unref, a as createBlock, y as withModifiers, g as createTextVNode, w as withDirectives, e as vModelText, n as createVNode, p as withCtx, r as ref, q as resolveComponent, l as useRouter, m as openBlock, z as notify } from "./index-BhP8XgzU.js";
import { u as useApi, A as AppSpinner } from "./AppSpinner-DLdDc0YF.js";
const _hoisted_1 = { class: "page" };
const _hoisted_2 = { class: "row" };
const _hoisted_3 = ["disabled"];
const _sfc_main = {
  __name: "EditProfileView",
  setup(__props) {
    const router = useRouter();
    const { run, loading } = useApi();
    const name = ref("");
    const username = ref("");
    const bio = ref("");
    const saving = ref(false);
    onMounted(async () => {
      const result = await run("me");
      const profile = result?.user_profile;
      if (profile) {
        name.value = profile.name || "";
        username.value = profile.username || "";
        bio.value = profile.bio || "";
      }
    });
    async function save() {
      saving.value = true;
      const results = await Promise.all([
        run("updateName", name.value.trim()),
        run("updateUsername", username.value.trim()),
        run("updateBio", bio.value)
      ]);
      saving.value = false;
      const failed = results.find((r) => r && r.success === false);
      if (failed) {
        notify({ type: "error", message: failed.error_message || "Some changes were rejected." });
        return;
      }
      notify({ type: "success", message: "Profile updated." });
      router.push({ name: "me" });
    }
    return (_ctx, _cache) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[7] || (_cache[7] = createBaseVNode("h1", { class: "page__title" }, "Edit profile", -1)),
        unref(loading) && !name.value ? (openBlock(), createBlock(AppSpinner, { key: 0 })) : (openBlock(), createElementBlock("form", {
          key: 1,
          class: "card stack",
          onSubmit: withModifiers(save, ["prevent"])
        }, [
          createBaseVNode("label", null, [
            _cache[3] || (_cache[3] = createTextVNode("Name ", -1)),
            withDirectives(createBaseVNode("input", {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => name.value = $event),
              maxlength: "64"
            }, null, 512), [
              [vModelText, name.value]
            ])
          ]),
          createBaseVNode("label", null, [
            _cache[4] || (_cache[4] = createTextVNode("Username ", -1)),
            withDirectives(createBaseVNode("input", {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => username.value = $event),
              maxlength: "32"
            }, null, 512), [
              [vModelText, username.value]
            ])
          ]),
          createBaseVNode("label", null, [
            _cache[5] || (_cache[5] = createTextVNode("Bio ", -1)),
            withDirectives(createBaseVNode("textarea", {
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => bio.value = $event),
              rows: "5"
            }, null, 512), [
              [vModelText, bio.value]
            ])
          ]),
          createBaseVNode("div", _hoisted_2, [
            createBaseVNode("button", {
              class: "btn",
              type: "submit",
              disabled: saving.value
            }, "Save", 8, _hoisted_3),
            createVNode(_component_RouterLink, {
              to: { name: "me" },
              class: "btn btn-secondary"
            }, {
              default: withCtx(() => [..._cache[6] || (_cache[6] = [
                createTextVNode("Cancel", -1)
              ])]),
              _: 1
            })
          ])
        ], 32))
      ]);
    };
  }
};
const EditProfileView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3d2ae451"]]);
export {
  EditProfileView as default
};
