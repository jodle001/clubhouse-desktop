import { A as AppAvatar } from "./AppAvatar-1OO_x6bT.js";
import { _ as _export_sfc, q as resolveComponent, m as openBlock, a as createBlock, p as withCtx, n as createVNode, b as createBaseVNode, t as toDisplayString, E as renderSlot } from "./index-BhP8XgzU.js";
const _hoisted_1 = { class: "grow" };
const _hoisted_2 = { class: "user-row__name truncate" };
const _hoisted_3 = { class: "muted truncate" };
const _sfc_main = {
  __name: "UserRow",
  props: {
    user: { type: Object, required: true },
    subtitle: { type: String, default: "" }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      return openBlock(), createBlock(_component_RouterLink, {
        to: { name: "user", params: { id: __props.user.user_id } },
        class: "user-row"
      }, {
        default: withCtx(() => [
          createVNode(AppAvatar, {
            user: __props.user,
            size: 40
          }, null, 8, ["user"]),
          createBaseVNode("span", _hoisted_1, [
            createBaseVNode("span", _hoisted_2, toDisplayString(__props.user.name), 1),
            createBaseVNode("small", _hoisted_3, toDisplayString(__props.subtitle || (__props.user.username ? `@${__props.user.username}` : "")), 1)
          ]),
          renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ]),
        _: 3
      }, 8, ["to"]);
    };
  }
};
const UserRow = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-12808065"]]);
export {
  UserRow as U
};
