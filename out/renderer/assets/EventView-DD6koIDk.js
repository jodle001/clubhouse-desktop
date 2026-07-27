import { u as useApi, A as AppSpinner } from "./AppSpinner-DLdDc0YF.js";
import { U as UserRow } from "./UserRow-DOYaUkDT.js";
import { _ as _export_sfc, o as onMounted, c as createElementBlock, u as unref, a as createBlock, b as createBaseVNode, t as toDisplayString, h as createCommentVNode, F as Fragment, d as renderList, r as ref, m as openBlock } from "./index-BhP8XgzU.js";
import "./AppAvatar-1OO_x6bT.js";
const _hoisted_1 = { class: "page" };
const _hoisted_2 = {
  key: 1,
  class: "card"
};
const _hoisted_3 = { class: "event__name" };
const _hoisted_4 = { class: "muted" };
const _hoisted_5 = {
  key: 0,
  class: "event__desc"
};
const _sfc_main = {
  __name: "EventView",
  props: { id: { type: [String, Number], required: true } },
  setup(__props) {
    const props = __props;
    const { run, loading } = useApi();
    const event = ref(null);
    onMounted(async () => {
      const result = await run("getEvent", props.id);
      event.value = result?.event || result || null;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        unref(loading) ? (openBlock(), createBlock(AppSpinner, { key: 0 })) : event.value ? (openBlock(), createElementBlock("div", _hoisted_2, [
          createBaseVNode("h1", _hoisted_3, toDisplayString(event.value.name), 1),
          createBaseVNode("p", _hoisted_4, toDisplayString(event.value.time_start), 1),
          event.value.description ? (openBlock(), createElementBlock("p", _hoisted_5, toDisplayString(event.value.description), 1)) : createCommentVNode("", true),
          event.value.hosts?.length ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            _cache[0] || (_cache[0] = createBaseVNode("h2", { class: "page__subtitle" }, "Hosts", -1)),
            (openBlock(true), createElementBlock(Fragment, null, renderList(event.value.hosts, (h) => {
              return openBlock(), createBlock(UserRow, {
                key: h.user_id,
                user: h
              }, null, 8, ["user"]);
            }), 128))
          ], 64)) : createCommentVNode("", true)
        ])) : createCommentVNode("", true)
      ]);
    };
  }
};
const EventView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2c3d02f4"]]);
export {
  EventView as default
};
