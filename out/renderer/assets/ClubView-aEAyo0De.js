import { u as useApi, A as AppSpinner } from "./AppSpinner-DLdDc0YF.js";
import { U as UserRow } from "./UserRow-DOYaUkDT.js";
import { E as EmptyState } from "./EmptyState-CTkUBavE.js";
import { _ as _export_sfc, o as onMounted, c as createElementBlock, u as unref, a as createBlock, F as Fragment, b as createBaseVNode, t as toDisplayString, h as createCommentVNode, d as renderList, r as ref, m as openBlock } from "./index-BhP8XgzU.js";
import "./AppAvatar-1OO_x6bT.js";
const _hoisted_1 = { class: "page" };
const _hoisted_2 = { class: "card" };
const _hoisted_3 = { class: "club__name" };
const _hoisted_4 = { class: "muted" };
const _hoisted_5 = {
  key: 0,
  class: "club__desc"
};
const _sfc_main = {
  __name: "ClubView",
  props: { id: { type: [String, Number], required: true } },
  setup(__props) {
    const props = __props;
    const { run, loading } = useApi();
    const club = ref(null);
    const members = ref([]);
    const isFollower = ref(false);
    async function load() {
      const result = await run("getClub", Number(props.id));
      if (result?.success) {
        club.value = result.club;
        members.value = result.members || [];
        isFollower.value = Boolean(result.is_follower);
      }
    }
    async function toggleFollow() {
      await run(isFollower.value ? "unfollowClub" : "followClub", Number(props.id));
      await load();
    }
    onMounted(load);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        unref(loading) && !club.value ? (openBlock(), createBlock(AppSpinner, { key: 0 })) : club.value ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createBaseVNode("div", _hoisted_2, [
            createBaseVNode("h1", _hoisted_3, toDisplayString(club.value.name), 1),
            createBaseVNode("p", _hoisted_4, toDisplayString(club.value.num_members ?? 0) + " members · " + toDisplayString(club.value.num_followers ?? 0) + " followers", 1),
            club.value.description ? (openBlock(), createElementBlock("p", _hoisted_5, toDisplayString(club.value.description), 1)) : createCommentVNode("", true),
            createBaseVNode("button", {
              class: "btn",
              onClick: toggleFollow
            }, toDisplayString(isFollower.value ? "Following" : "Follow"), 1)
          ]),
          _cache[0] || (_cache[0] = createBaseVNode("h2", { class: "page__subtitle" }, "Members", -1)),
          !members.value.length ? (openBlock(), createBlock(EmptyState, {
            key: 0,
            message: "No members listed."
          })) : createCommentVNode("", true),
          (openBlock(true), createElementBlock(Fragment, null, renderList(members.value, (m) => {
            return openBlock(), createBlock(UserRow, {
              key: m.user_id,
              user: m
            }, null, 8, ["user"]);
          }), 128))
        ], 64)) : createCommentVNode("", true)
      ]);
    };
  }
};
const ClubView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c644c1d1"]]);
export {
  ClubView as default
};
