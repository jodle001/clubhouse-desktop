import { _ as _export_sfc, m as openBlock, c as createElementBlock, G as normalizeStyle, t as toDisplayString, k as computed } from "./index-BhP8XgzU.js";
const _hoisted_1 = ["src", "alt"];
const _sfc_main = {
  __name: "AppAvatar",
  props: {
    user: { type: Object, default: () => ({}) },
    size: { type: Number, default: 48 }
  },
  setup(__props) {
    const props = __props;
    const initials = computed(() => {
      const name = props.user?.name || props.user?.username || "?";
      return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    });
    const style = computed(() => ({
      width: `${props.size}px`,
      height: `${props.size}px`,
      fontSize: `${Math.max(11, props.size / 2.8)}px`
    }));
    return (_ctx, _cache) => {
      return __props.user?.photo_url ? (openBlock(), createElementBlock("img", {
        key: 0,
        src: __props.user.photo_url,
        alt: __props.user.name || "",
        class: "avatar",
        style: normalizeStyle(style.value)
      }, null, 12, _hoisted_1)) : (openBlock(), createElementBlock("span", {
        key: 1,
        class: "avatar avatar--fallback",
        style: normalizeStyle(style.value),
        "aria-hidden": "true"
      }, toDisplayString(initials.value), 5));
    };
  }
};
const AppAvatar = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-15eebc99"]]);
export {
  AppAvatar as A
};
