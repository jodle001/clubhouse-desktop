import { u as useApi, A as AppSpinner } from "./AppSpinner-DLdDc0YF.js";
import { _ as _export_sfc, o as onMounted, D as watch, c as createElementBlock, u as unref, a as createBlock, n as createVNode, b as createBaseVNode, t as toDisplayString, p as withCtx, h as createCommentVNode, r as ref, q as resolveComponent, k as computed, m as openBlock, g as createTextVNode, i as useSession } from "./index-BhP8XgzU.js";
import { A as AppAvatar } from "./AppAvatar-1OO_x6bT.js";
const _hoisted_1 = { class: "page" };
const _hoisted_2 = {
  key: 1,
  class: "card profile"
};
const _hoisted_3 = { class: "profile__name" };
const _hoisted_4 = { class: "muted" };
const _hoisted_5 = { class: "profile__counts" };
const _hoisted_6 = {
  key: 0,
  class: "profile__bio"
};
const _hoisted_7 = { class: "row profile__actions" };
const _hoisted_8 = ["disabled"];
const _sfc_main = {
  __name: "ProfileView",
  props: { id: { type: [String, Number], required: true } },
  setup(__props) {
    const props = __props;
    const { state } = useSession();
    const { run, loading } = useApi();
    const profile = ref(null);
    const busy = ref(false);
    const isMe = computed(
      () => props.id === "me" || Number(props.id) === state.user?.user_profile?.user_id
    );
    async function load() {
      const result = isMe.value ? await run("me") : await run("getProfile", Number(props.id));
      profile.value = result?.user_profile || null;
    }
    async function toggleFollow() {
      if (!profile.value) return;
      busy.value = true;
      const method = profile.value.notification_type === 0 ? "follow" : "unfollow";
      await run(method, profile.value.user_id);
      await load();
      busy.value = false;
    }
    onMounted(load);
    watch(() => props.id, load);
    return (_ctx, _cache) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        unref(loading) && !profile.value ? (openBlock(), createBlock(AppSpinner, { key: 0 })) : profile.value ? (openBlock(), createElementBlock("div", _hoisted_2, [
          createVNode(AppAvatar, {
            user: profile.value,
            size: 96
          }, null, 8, ["user"]),
          createBaseVNode("h1", _hoisted_3, toDisplayString(profile.value.name), 1),
          createBaseVNode("p", _hoisted_4, "@" + toDisplayString(profile.value.username), 1),
          createBaseVNode("div", _hoisted_5, [
            createVNode(_component_RouterLink, {
              to: { name: "userlist", params: { id: profile.value.user_id, type: "followers" } }
            }, {
              default: withCtx(() => [
                createBaseVNode("strong", null, toDisplayString(profile.value.num_followers ?? 0), 1),
                _cache[0] || (_cache[0] = createTextVNode(" followers ", -1))
              ]),
              _: 1
            }, 8, ["to"]),
            createVNode(_component_RouterLink, {
              to: { name: "userlist", params: { id: profile.value.user_id, type: "following" } }
            }, {
              default: withCtx(() => [
                createBaseVNode("strong", null, toDisplayString(profile.value.num_following ?? 0), 1),
                _cache[1] || (_cache[1] = createTextVNode(" following ", -1))
              ]),
              _: 1
            }, 8, ["to"])
          ]),
          profile.value.bio ? (openBlock(), createElementBlock("p", _hoisted_6, toDisplayString(profile.value.bio), 1)) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_7, [
            isMe.value ? (openBlock(), createBlock(_component_RouterLink, {
              key: 0,
              to: { name: "editProfile" },
              class: "btn btn-secondary"
            }, {
              default: withCtx(() => [..._cache[2] || (_cache[2] = [
                createTextVNode("Edit profile", -1)
              ])]),
              _: 1
            })) : (openBlock(), createElementBlock("button", {
              key: 1,
              class: "btn",
              disabled: busy.value,
              onClick: toggleFollow
            }, toDisplayString(profile.value.notification_type === 0 ? "Follow" : "Following"), 9, _hoisted_8))
          ])
        ])) : createCommentVNode("", true)
      ]);
    };
  }
};
const ProfileView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d4aa3e0c"]]);
export {
  ProfileView as default
};
