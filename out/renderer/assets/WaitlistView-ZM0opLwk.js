import { _ as _export_sfc, c as createElementBlock, b as createBaseVNode, i as useSession, l as useRouter, m as openBlock } from "./index-BhP8XgzU.js";
const _hoisted_1 = { class: "center-screen" };
const _sfc_main = {
  __name: "WaitlistView",
  setup(__props) {
    const router = useRouter();
    const { signOut } = useSession();
    async function logout() {
      await signOut();
      router.push({ name: "login" });
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", { class: "card waitlist" }, [
          _cache[0] || (_cache[0] = createBaseVNode("div", {
            class: "waitlist__logo",
            "aria-hidden": "true"
          }, "👋", -1)),
          _cache[1] || (_cache[1] = createBaseVNode("h1", null, "You're on the waitlist", -1)),
          _cache[2] || (_cache[2] = createBaseVNode("p", { class: "muted" }, " Ask a friend already on Clubhouse to let you in. If someone has just invited you, log out and back in to pick it up. ", -1)),
          createBaseVNode("button", {
            class: "btn",
            onClick: logout
          }, "Log out")
        ])
      ]);
    };
  }
};
const WaitlistView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9709c1e9"]]);
export {
  WaitlistView as default
};
