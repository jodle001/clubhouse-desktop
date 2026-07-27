import { _ as _export_sfc, q as resolveComponent, m as openBlock, a as createBlock, p as withCtx, b as createBaseVNode, t as toDisplayString, c as createElementBlock, F as Fragment, d as renderList, g as createTextVNode, h as createCommentVNode, o as onMounted, x as onUnmounted, w as withDirectives, e as vModelText, y as withModifiers, r as ref, k as computed, l as useRouter, n as createVNode, z as notify, i as useSession } from "./index-BhP8XgzU.js";
import { u as useApi, A as AppSpinner } from "./AppSpinner-DLdDc0YF.js";
import { A as AppAvatar } from "./AppAvatar-1OO_x6bT.js";
import { U as UserRow } from "./UserRow-DOYaUkDT.js";
import { E as EmptyState } from "./EmptyState-CTkUBavE.js";
const NON_LATIN = /[぀-ヿ㐀-䶿一-鿿豈-﫿ｦ-ﾟ]/;
function isLatin(text) {
  if (!text) {
    return true;
  }
  return !NON_LATIN.test(text);
}
const _hoisted_1$1 = { class: "room-card__topic" };
const _hoisted_2$1 = { class: "room-card__people" };
const _hoisted_3$1 = { class: "room-card__names" };
const _hoisted_4$1 = {
  key: 0,
  "aria-label": "moderator"
};
const _hoisted_5$1 = { class: "room-card__meta muted" };
const _hoisted_6$1 = { key: 0 };
const _sfc_main$1 = {
  __name: "RoomCard",
  props: {
    room: { type: Object, required: true }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      return openBlock(), createBlock(_component_RouterLink, {
        to: { name: "room", params: { channel: __props.room.channel } },
        class: "room-card"
      }, {
        default: withCtx(() => [
          createBaseVNode("h3", _hoisted_1$1, toDisplayString(__props.room.topic || "Untitled room"), 1),
          createBaseVNode("div", _hoisted_2$1, [
            (openBlock(true), createElementBlock(Fragment, null, renderList((__props.room.users || []).slice(0, 4), (u) => {
              return openBlock(), createBlock(AppAvatar, {
                key: u.user_id,
                user: u,
                size: 30
              }, null, 8, ["user"]);
            }), 128)),
            _cache[0] || (_cache[0] = createBaseVNode("span", { class: "grow" }, null, -1))
          ]),
          createBaseVNode("ul", _hoisted_3$1, [
            (openBlock(true), createElementBlock(Fragment, null, renderList((__props.room.users || []).slice(0, 3), (u) => {
              return openBlock(), createElementBlock("li", {
                key: u.user_id,
                class: "truncate"
              }, [
                createTextVNode(toDisplayString(u.name), 1),
                u.is_moderator ? (openBlock(), createElementBlock("span", _hoisted_4$1, " ✳️")) : createCommentVNode("", true)
              ]);
            }), 128))
          ]),
          createBaseVNode("footer", _hoisted_5$1, [
            createBaseVNode("span", null, "👥 " + toDisplayString(__props.room.num_all ?? 0), 1),
            createBaseVNode("span", null, "💬 " + toDisplayString(__props.room.num_speakers ?? 0), 1),
            __props.room.is_private ? (openBlock(), createElementBlock("span", _hoisted_6$1, "🔒 private")) : createCommentVNode("", true)
          ])
        ]),
        _: 1
      }, 8, ["to"]);
    };
  }
};
const RoomCard = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-a565af2f"]]);
const _hoisted_1 = { class: "home" };
const _hoisted_2 = { class: "home__side" };
const _hoisted_3 = {
  key: 1,
  class: "home__events"
};
const _hoisted_4 = { class: "truncate" };
const _hoisted_5 = { class: "muted truncate" };
const _hoisted_6 = { class: "home__rooms" };
const _hoisted_7 = { class: "home__toolbar" };
const _hoisted_8 = { class: "row" };
const _hoisted_9 = {
  key: 3,
  class: "home__grid"
};
const _hoisted_10 = { class: "home__side" };
const _sfc_main = {
  __name: "HomeView",
  setup(__props) {
    const router = useRouter();
    const { state } = useSession();
    const { run } = useApi();
    const rooms = ref([]);
    const events = ref([]);
    const friends = ref([]);
    const loading = ref(true);
    const filter = ref("");
    const creating = ref(false);
    const newTopic = ref("");
    let timer = null;
    const visibleRooms = computed(() => {
      const needle = filter.value.trim().toLowerCase();
      return rooms.value.filter((room) => {
        if (state.settings.filterNonLatinRooms && !isLatin(room.topic)) {
          return false;
        }
        if (!needle) {
          return true;
        }
        const haystack = [room.topic, ...(room.users || []).map((u) => u.name)].join(" ").toLowerCase();
        return haystack.includes(needle);
      });
    });
    async function refresh() {
      const [channels, friendList] = await Promise.all([
        run("getChannels"),
        run("getOnlineFriends")
      ]);
      if (channels?.channels) {
        rooms.value = channels.channels;
      }
      if (friendList?.users) {
        friends.value = friendList.users;
      }
      loading.value = false;
    }
    async function createRoom() {
      const result = await run("createChannel", { topic: newTopic.value.trim() });
      if (result?.success) {
        creating.value = false;
        newTopic.value = "";
        router.push({ name: "room", params: { channel: result.channel } });
      } else if (result) {
        notify({ type: "error", message: result.error_message || "Could not create the room." });
      }
    }
    onMounted(async () => {
      await refresh();
      const eventList = await run("getEvents");
      if (eventList?.events) {
        events.value = eventList.events;
      }
      timer = setInterval(refresh, 3e4);
    });
    onUnmounted(() => clearInterval(timer));
    return (_ctx, _cache) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("aside", _hoisted_2, [
          _cache[4] || (_cache[4] = createBaseVNode("h2", { class: "home__heading" }, "Upcoming", -1)),
          !events.value.length ? (openBlock(), createBlock(EmptyState, {
            key: 0,
            message: "No upcoming events."
          })) : (openBlock(), createElementBlock("ul", _hoisted_3, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(events.value.slice(0, 8), (event) => {
              return openBlock(), createElementBlock("li", {
                key: event.event_id
              }, [
                createVNode(_component_RouterLink, {
                  to: { name: "event", params: { id: event.event_hashid || event.event_id } }
                }, {
                  default: withCtx(() => [
                    createBaseVNode("strong", _hoisted_4, toDisplayString(event.name), 1),
                    createBaseVNode("small", _hoisted_5, toDisplayString(event.club?.name || event.description), 1)
                  ]),
                  _: 2
                }, 1032, ["to"])
              ]);
            }), 128))
          ]))
        ]),
        createBaseVNode("section", _hoisted_6, [
          createBaseVNode("header", _hoisted_7, [
            withDirectives(createBaseVNode("input", {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => filter.value = $event),
              type: "search",
              placeholder: "Filter rooms",
              "aria-label": "Filter rooms"
            }, null, 512), [
              [vModelText, filter.value]
            ]),
            createBaseVNode("button", {
              class: "btn",
              onClick: _cache[1] || (_cache[1] = ($event) => creating.value = !creating.value)
            }, "＋ Room")
          ]),
          creating.value ? (openBlock(), createElementBlock("form", {
            key: 0,
            class: "home__create card",
            onSubmit: withModifiers(createRoom, ["prevent"])
          }, [
            withDirectives(createBaseVNode("input", {
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => newTopic.value = $event),
              placeholder: "What do you want to talk about?",
              "aria-label": "Room topic"
            }, null, 512), [
              [vModelText, newTopic.value]
            ]),
            createBaseVNode("div", _hoisted_8, [
              _cache[5] || (_cache[5] = createBaseVNode("button", {
                class: "btn",
                type: "submit"
              }, "Start room", -1)),
              createBaseVNode("button", {
                class: "btn btn-secondary",
                type: "button",
                onClick: _cache[3] || (_cache[3] = ($event) => creating.value = false)
              }, "Cancel")
            ])
          ], 32)) : createCommentVNode("", true),
          loading.value ? (openBlock(), createBlock(AppSpinner, { key: 1 })) : !visibleRooms.value.length ? (openBlock(), createBlock(EmptyState, {
            key: 2,
            icon: "🫙",
            message: "No rooms match right now."
          })) : (openBlock(), createElementBlock("div", _hoisted_9, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(visibleRooms.value, (room) => {
              return openBlock(), createBlock(RoomCard, {
                key: room.channel,
                room
              }, null, 8, ["room"]);
            }), 128))
          ]))
        ]),
        createBaseVNode("aside", _hoisted_10, [
          _cache[6] || (_cache[6] = createBaseVNode("h2", { class: "home__heading" }, "Online", -1)),
          !friends.value.length ? (openBlock(), createBlock(EmptyState, {
            key: 0,
            message: "Nobody you follow is online."
          })) : createCommentVNode("", true),
          (openBlock(true), createElementBlock(Fragment, null, renderList(friends.value, (user) => {
            return openBlock(), createBlock(UserRow, {
              key: user.user_id,
              user,
              subtitle: "Online"
            }, null, 8, ["user"]);
          }), 128))
        ])
      ]);
    };
  }
};
const HomeView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-544bb28c"]]);
export {
  HomeView as default
};
