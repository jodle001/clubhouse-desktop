import { u as useApi, A as AppSpinner } from "./AppSpinner-DLdDc0YF.js";
import { U as UserRow } from "./UserRow-DOYaUkDT.js";
import { E as EmptyState } from "./EmptyState-CTkUBavE.js";
import { _ as _export_sfc, o as onMounted, c as createElementBlock, b as createBaseVNode, t as toDisplayString, u as unref, a as createBlock, F as Fragment, d as renderList, r as ref, k as computed, m as openBlock } from "./index-BhP8XgzU.js";
import "./AppAvatar-1OO_x6bT.js";
const _hoisted_1 = { class: "page" };
const _hoisted_2 = { class: "page__title" };
const _hoisted_3 = {
  key: 2,
  class: "list"
};
const _sfc_main = {
  __name: "UserListView",
  props: {
    id: { type: [String, Number], required: true },
    type: { type: String, required: true }
  },
  setup(__props) {
    const props = __props;
    const { run, loading } = useApi();
    const users = ref([]);
    const title = computed(() => props.type === "followers" ? "Followers" : "Following");
    onMounted(async () => {
      const method = props.type === "followers" ? "getFollowers" : "getFollowing";
      const result = await run(method, Number(props.id));
      users.value = result?.users || [];
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("h1", _hoisted_2, toDisplayString(title.value), 1),
        unref(loading) ? (openBlock(), createBlock(AppSpinner, { key: 0 })) : !users.value.length ? (openBlock(), createBlock(EmptyState, {
          key: 1,
          message: `No ${title.value.toLowerCase()} yet.`
        }, null, 8, ["message"])) : (openBlock(), createElementBlock("div", _hoisted_3, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(users.value, (u) => {
            return openBlock(), createBlock(UserRow, {
              key: u.user_id,
              user: u
            }, null, 8, ["user"]);
          }), 128))
        ]))
      ]);
    };
  }
};
const UserListView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-264498f4"]]);
export {
  UserListView as default
};
