import { _ as _export_sfc, m as openBlock, c as createElementBlock, t as toDisplayString, h as createCommentVNode, g as createTextVNode } from "./index-BhP8XgzU.js";
const _hoisted_1 = { class: "empty muted" };
const _hoisted_2 = {
  key: 0,
  class: "empty__icon"
};
const _sfc_main = {
  __name: "EmptyState",
  props: {
    message: { type: String, default: "Nothing here yet." },
    icon: { type: String, default: "" }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("p", _hoisted_1, [
        __props.icon ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString(__props.icon), 1)) : createCommentVNode("", true),
        createTextVNode(" " + toDisplayString(__props.message), 1)
      ]);
    };
  }
};
const EmptyState = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0abf1922"]]);
export {
  EmptyState as E
};
