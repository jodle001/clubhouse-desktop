import { _ as _export_sfc, o as onMounted, c as createElementBlock, b as createBaseVNode, u as unref, F as Fragment, d as renderList, w as withDirectives, H as vModelCheckbox, g as createTextVNode, r as ref, i as useSession, I as useTheme, j as updateSettings, z as notify, m as openBlock, t as toDisplayString } from "./index-BhP8XgzU.js";
const _hoisted_1 = { class: "page" };
const _hoisted_2 = { class: "card stack" };
const _hoisted_3 = { class: "field" };
const _hoisted_4 = ["value"];
const _hoisted_5 = ["value"];
const _hoisted_6 = { class: "card stack" };
const _hoisted_7 = { class: "check" };
const _hoisted_8 = { class: "card stack" };
const _hoisted_9 = { class: "check" };
const _sfc_main = {
  __name: "SettingsView",
  setup(__props) {
    const { state } = useSession();
    const { theme, setTheme, THEMES } = useTheme();
    const audioEnabled = ref(false);
    const filterNonLatinRooms = ref(false);
    onMounted(() => {
      audioEnabled.value = Boolean(state.settings.audioEnabled);
      filterNonLatinRooms.value = Boolean(state.settings.filterNonLatinRooms);
    });
    async function toggleAudio() {
      await updateSettings({ audioEnabled: audioEnabled.value });
      notify({
        message: audioEnabled.value ? "Audio enabled. Rejoin a room to connect." : "Audio disabled. Rooms will be silent."
      });
    }
    function toggleFilter() {
      updateSettings({ filterNonLatinRooms: filterNonLatinRooms.value });
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[9] || (_cache[9] = createBaseVNode("h1", { class: "page__title" }, "Settings", -1)),
        createBaseVNode("section", _hoisted_2, [
          _cache[4] || (_cache[4] = createBaseVNode("h2", { class: "section__title" }, "Appearance", -1)),
          createBaseVNode("label", _hoisted_3, [
            _cache[3] || (_cache[3] = createBaseVNode("span", null, "Theme", -1)),
            createBaseVNode("select", {
              value: unref(theme),
              onChange: _cache[0] || (_cache[0] = ($event) => unref(setTheme)($event.target.value))
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(THEMES), (t) => {
                return openBlock(), createElementBlock("option", {
                  key: t,
                  value: t
                }, toDisplayString(t), 9, _hoisted_5);
              }), 128))
            ], 40, _hoisted_4)
          ])
        ]),
        createBaseVNode("section", _hoisted_6, [
          _cache[6] || (_cache[6] = createBaseVNode("h2", { class: "section__title" }, "Audio", -1)),
          createBaseVNode("label", _hoisted_7, [
            withDirectives(createBaseVNode("input", {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => audioEnabled.value = $event),
              type: "checkbox",
              onChange: toggleAudio
            }, null, 544), [
              [vModelCheckbox, audioEnabled.value]
            ]),
            _cache[5] || (_cache[5] = createBaseVNode("span", null, [
              createTextVNode(" Enable room audio "),
              createBaseVNode("small", { class: "muted" }, " Loads the Agora SDK and connects to room audio. Off by default — the rest of the app works either way. ")
            ], -1))
          ])
        ]),
        createBaseVNode("section", _hoisted_8, [
          _cache[8] || (_cache[8] = createBaseVNode("h2", { class: "section__title" }, "Rooms", -1)),
          createBaseVNode("label", _hoisted_9, [
            withDirectives(createBaseVNode("input", {
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => filterNonLatinRooms.value = $event),
              type: "checkbox",
              onChange: toggleFilter
            }, null, 544), [
              [vModelCheckbox, filterNonLatinRooms.value]
            ]),
            _cache[7] || (_cache[7] = createBaseVNode("span", null, [
              createTextVNode(" Hide rooms with non-Latin titles "),
              createBaseVNode("small", { class: "muted" }, "Filters topics written in CJK scripts.")
            ], -1))
          ])
        ]),
        _cache[10] || (_cache[10] = createBaseVNode("p", { class: "muted about" }, [
          createTextVNode(" Clubhouse Desktop · unofficial client · originally by "),
          createBaseVNode("a", {
            href: "https://callmearta.ir",
            target: "_blank",
            rel: "noreferrer"
          }, "Arta Mo")
        ], -1))
      ]);
    };
  }
};
const SettingsView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cd77a0b5"]]);
export {
  SettingsView as default
};
