import { u as useApi, A as AppSpinner } from "./AppSpinner-DLdDc0YF.js";
import { A as AppAvatar } from "./AppAvatar-1OO_x6bT.js";
import { E as EmptyState } from "./EmptyState-CTkUBavE.js";
import { _ as _export_sfc, o as onMounted, c as createElementBlock, b as createBaseVNode, u as unref, a as createBlock, F as Fragment, d as renderList, r as ref, m as openBlock, n as createVNode, t as toDisplayString } from "./index-BhP8XgzU.js";
const _hoisted_1 = { class: "page" };
const _hoisted_2 = {
  key: 2,
  class: "list"
};
const _hoisted_3 = { class: "grow" };
const _hoisted_4 = { class: "muted" };
const _sfc_main = {
  __name: "NotificationsView",
  setup(__props) {
    const { run, loading } = useApi();
    const items = ref([]);
    onMounted(async () => {
      const result = await run("getNotifications");
      if (result?.notifications) {
        items.value = result.notifications;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[0] || (_cache[0] = createBaseVNode("h1", { class: "page__title" }, "Activity", -1)),
        unref(loading) ? (openBlock(), createBlock(AppSpinner, { key: 0 })) : !items.value.length ? (openBlock(), createBlock(EmptyState, {
          key: 1,
          icon: "🔔",
          message: "No activity yet."
        })) : (openBlock(), createElementBlock("ul", _hoisted_2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(items.value, (n) => {
            return openBlock(), createElementBlock("li", {
              key: n.notification_id,
              class: "row"
            }, [
              createVNode(AppAvatar, {
                user: n.user_profile || {},
                size: 40
              }, null, 8, ["user"]),
              createBaseVNode("span", _hoisted_3, [
                createBaseVNode("span", null, toDisplayString(n.message), 1),
                createBaseVNode("small", _hoisted_4, toDisplayString(n.time_created), 1)
              ])
            ]);
          }), 128))
        ]))
      ]);
    };
  }
};
const NotificationsView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a4ca199d"]]);
export {
  NotificationsView as default
};
