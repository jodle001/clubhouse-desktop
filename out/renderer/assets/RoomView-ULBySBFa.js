const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./AgoraRTC_N-production-Cp_PcB9O.js","./_commonjsHelpers-DWwsNxpa.js","./pubnub.min-CeuHUT3z.js"])))=>i.map(i=>d[i]);
import { A as __vitePreload, r as ref, k as computed, B as reactive, _ as _export_sfc, m as openBlock, c as createElementBlock, b as createBaseVNode, n as createVNode, h as createCommentVNode, g as createTextVNode, t as toDisplayString, C as normalizeClass, o as onMounted, x as onUnmounted, u as unref, a as createBlock, F as Fragment, d as renderList, i as useSession, l as useRouter } from "./index-BhP8XgzU.js";
import { c as call, A as AppSpinner } from "./AppSpinner-DLdDc0YF.js";
import { A as AppAvatar } from "./AppAvatar-1OO_x6bT.js";
import { E as EmptyState } from "./EmptyState-CTkUBavE.js";
let Emitter$1 = class Emitter {
  constructor() {
    this._handlers = /* @__PURE__ */ new Map();
  }
  on(event, handler) {
    if (!this._handlers.has(event)) {
      this._handlers.set(event, /* @__PURE__ */ new Set());
    }
    this._handlers.get(event).add(handler);
    return () => this._handlers.get(event)?.delete(handler);
  }
  emit(event, payload) {
    for (const handler of this._handlers.get(event) || []) {
      handler(payload);
    }
  }
};
class NullAudioEngine extends Emitter$1 {
  constructor({ log = () => {
  } } = {}) {
    super();
    this.name = "null";
    this._muted = true;
    this._joined = null;
    this.log = log;
  }
  async join({ channel }) {
    this._joined = channel;
    this.log(`[audio:null] pretending to join ${channel}`);
    this.emit("joined", { channel });
  }
  async leave() {
    this.log(`[audio:null] pretending to leave ${this._joined}`);
    this._joined = null;
    this.emit("left", {});
  }
  async setMuted(muted) {
    this._muted = Boolean(muted);
    this.emit("muted", { muted: this._muted });
  }
  isMuted() {
    return this._muted;
  }
  isJoined() {
    return this._joined !== null;
  }
  async destroy() {
    this._joined = null;
  }
}
class AgoraAudioEngine extends Emitter$1 {
  constructor({ log = () => {
  } } = {}) {
    super();
    this.name = "agora";
    this.log = log;
    this._client = null;
    this._track = null;
    this._muted = true;
    this._joined = null;
  }
  async _sdk() {
    const module = await __vitePreload(() => import("./AgoraRTC_N-production-Cp_PcB9O.js").then((n) => n.A), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url);
    return module.default || module;
  }
  async join({ appId, channel, token, uid }) {
    const AgoraRTC = await this._sdk();
    AgoraRTC.setLogLevel(3);
    this._client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    this._client.on("user-published", async (user, mediaType) => {
      if (mediaType !== "audio") {
        return;
      }
      await this._client.subscribe(user, mediaType);
      user.audioTrack?.play();
      this.emit("remote-joined", { uid: user.uid });
    });
    this._client.on("user-unpublished", (user) => this.emit("remote-left", { uid: user.uid }));
    this._client.enableAudioVolumeIndicator();
    this._client.on("volume-indicator", (volumes) => {
      this.emit(
        "speaking",
        volumes.filter((v) => v.level > 5).map((v) => ({ uid: v.uid, level: v.level }))
      );
    });
    await this._client.join(appId, channel, token || null, uid);
    this._joined = channel;
    this.emit("joined", { channel });
  }
  async setMuted(muted) {
    const AgoraRTC = await this._sdk();
    if (muted) {
      if (this._track) {
        await this._client?.unpublish([this._track]);
        this._track.close();
        this._track = null;
      }
    } else if (!this._track) {
      this._track = await AgoraRTC.createMicrophoneAudioTrack();
      await this._client?.publish([this._track]);
    }
    this._muted = Boolean(muted);
    this.emit("muted", { muted: this._muted });
  }
  isMuted() {
    return this._muted;
  }
  isJoined() {
    return this._joined !== null;
  }
  async leave() {
    await this.setMuted(true);
    await this._client?.leave();
    this._joined = null;
    this.emit("left", {});
  }
  async destroy() {
    try {
      await this.leave();
    } catch {
    }
    this._client = null;
  }
}
async function createAudioEngine({ enabled = false, log = () => {
} } = {}) {
  if (!enabled) {
    return new NullAudioEngine({ log });
  }
  try {
    await __vitePreload(() => import("./AgoraRTC_N-production-Cp_PcB9O.js").then((n) => n.A), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url);
    return new AgoraAudioEngine({ log });
  } catch (error) {
    log(`[audio] agora-rtc-sdk-ng unavailable (${error.message}); running silent`);
    return new NullAudioEngine({ log });
  }
}
const ACTIONS = [
  "join_channel",
  "leave_channel",
  "end_channel",
  "add_speaker",
  "remove_speaker",
  "make_moderator",
  "invite_speaker",
  "raise_hands",
  "unraise_hands"
];
class Emitter2 {
  constructor() {
    this._handlers = /* @__PURE__ */ new Map();
  }
  on(event, handler) {
    if (!this._handlers.has(event)) {
      this._handlers.set(event, /* @__PURE__ */ new Set());
    }
    this._handlers.get(event).add(handler);
    return () => this._handlers.get(event)?.delete(handler);
  }
  emit(event, payload) {
    for (const handler of this._handlers.get(event) || []) {
      handler(payload);
    }
  }
}
class NullRoomEvents extends Emitter2 {
  constructor({ log = () => {
  } } = {}) {
    super();
    this.name = "null";
    this.log = log;
  }
  async subscribe(channel) {
    this.log(`[room:null] not subscribing to ${channel.channel}`);
  }
  async unsubscribe() {
  }
}
class PubNubRoomEvents extends Emitter2 {
  constructor({ publishKey, subscribeKey, userId, log = () => {
  } } = {}) {
    super();
    this.name = "pubnub";
    this.publishKey = publishKey;
    this.subscribeKey = subscribeKey;
    this.userId = userId;
    this.log = log;
    this._pubnub = null;
  }
  async subscribe(channel) {
    const { default: PubNub } = await __vitePreload(async () => {
      const { default: PubNub2 } = await import("./pubnub.min-CeuHUT3z.js").then((n) => n.p);
      return { default: PubNub2 };
    }, true ? __vite__mapDeps([2,1]) : void 0, import.meta.url);
    this._pubnub = new PubNub({
      publishKey: this.publishKey,
      subscribeKey: this.subscribeKey,
      userId: String(this.userId),
      authKey: channel.pubnub_token,
      origin: channel.pubnub_origin || void 0,
      heartbeatInterval: channel.pubnub_heartbeat_interval || 60,
      presenceTimeout: channel.pubnub_heartbeat_value || 60
    });
    this._pubnub.addListener({
      message: ({ message }) => {
        if (message && ACTIONS.includes(message.action)) {
          this.emit(message.action, message);
        }
      },
      status: (event) => this.log(`[room:pubnub] ${event.category}`)
    });
    const channels = [
      `channel_all.${channel.channel}`,
      `channel_user.${channel.channel}.${this.userId}`,
      `users.${this.userId}`
    ];
    if (channel.is_moderator) {
      channels.push(`channel_speakers.${channel.channel}`);
    }
    this._pubnub.subscribe({ channels });
  }
  async unsubscribe() {
    this._pubnub?.unsubscribeAll();
    this._pubnub?.destroy?.();
    this._pubnub = null;
  }
}
async function createRoomEvents({ enabled = true, publishKey, subscribeKey, userId, log = () => {
} } = {}) {
  if (!enabled || !publishKey || !subscribeKey) {
    return new NullRoomEvents({ log });
  }
  try {
    await __vitePreload(() => import("./pubnub.min-CeuHUT3z.js").then((n) => n.p), true ? __vite__mapDeps([2,1]) : void 0, import.meta.url);
    return new PubNubRoomEvents({ publishKey, subscribeKey, userId, log });
  } catch (error) {
    log(`[room] pubnub unavailable (${error.message}); live updates off`);
    return new NullRoomEvents({ log });
  }
}
const SERVICES = Object.freeze({
  agoraAppId: "938de3e8055e42b281bb8c6f69c21f78",
  pubnubOrigin: "https://clubhouse.pubnub.com",
  pubnubPublishKey: "pub-c-6878d382-5ae6-4494-9099-f930f938868b",
  pubnubSubscribeKey: "sub-c-a4abea84-9ca3-11ea-8e71-f2b83ac9263d"
});
function useRoom({ makeAudio = createAudioEngine, makeEvents = createRoomEvents } = {}) {
  const channel = reactive({ info: null, users: [] });
  const speakingUids = ref(/* @__PURE__ */ new Set());
  const muted = ref(true);
  const handRaised = ref(false);
  const joining = ref(false);
  const error = ref("");
  let audio = null;
  let events = null;
  let pingTimer = null;
  const me = computed(() => channel.info?.users?.find((u) => u.is_self) || null);
  const speakers = computed(() => channel.users.filter((u) => u.is_speaker));
  const audience = computed(() => channel.users.filter((u) => !u.is_speaker));
  function upsertUser(user) {
    const index = channel.users.findIndex((u) => u.user_id === user.user_id);
    if (index === -1) {
      channel.users.push(user);
    } else {
      channel.users[index] = { ...channel.users[index], ...user };
    }
  }
  function removeUser(userId) {
    const index = channel.users.findIndex((u) => u.user_id === userId);
    if (index !== -1) {
      channel.users.splice(index, 1);
    }
  }
  function patchUser(userId, patch) {
    const user = channel.users.find((u) => u.user_id === userId);
    if (user) {
      Object.assign(user, patch);
    }
  }
  async function join(channelName, { userId, audioEnabled = false } = {}) {
    joining.value = true;
    error.value = "";
    try {
      const info = await call("joinChannel", channelName);
      if (!info.success) {
        error.value = info.error_message || "Could not join the room.";
        return false;
      }
      channel.info = info;
      channel.users = info.users || [];
      audio = await makeAudio({ enabled: audioEnabled, log: console.log });
      await audio.join({
        appId: SERVICES.agoraAppId,
        channel: info.channel,
        token: info.token,
        uid: userId
      });
      muted.value = audio.isMuted();
      audio.on("speaking", (list) => {
        speakingUids.value = new Set(list.map((entry) => Number(entry.uid)));
      });
      events = await makeEvents({
        publishKey: SERVICES.pubnubPublishKey,
        subscribeKey: SERVICES.pubnubSubscribeKey,
        userId,
        log: console.log
      });
      events.on("join_channel", (message) => upsertUser(message.user_profile));
      events.on("leave_channel", (message) => removeUser(message.user_id));
      events.on("add_speaker", (message) => patchUser(message.user_id, { is_speaker: true }));
      events.on("remove_speaker", (message) => patchUser(message.user_id, { is_speaker: false }));
      events.on("make_moderator", (message) => patchUser(message.user_id, { is_moderator: true }));
      events.on("raise_hands", (message) => patchUser(message.user_id, { hand_raised: true }));
      events.on("unraise_hands", (message) => patchUser(message.user_id, { hand_raised: false }));
      events.on("end_channel", () => leave());
      await events.subscribe(info);
      pingTimer = setInterval(() => call("activePing", channelName).catch(() => {
      }), 3e4);
      return true;
    } catch (err) {
      error.value = err.message;
      return false;
    } finally {
      joining.value = false;
    }
  }
  async function leave() {
    clearInterval(pingTimer);
    pingTimer = null;
    const name = channel.info?.channel;
    await events?.unsubscribe();
    await audio?.destroy();
    events = null;
    audio = null;
    if (name) {
      await call("leaveChannel", name).catch(() => {
      });
    }
    channel.info = null;
    channel.users = [];
  }
  async function toggleMute() {
    if (!audio) {
      return;
    }
    await audio.setMuted(!muted.value);
    muted.value = audio.isMuted();
  }
  async function toggleHand() {
    const name = channel.info?.channel;
    if (!name) {
      return;
    }
    handRaised.value = !handRaised.value;
    await call("raiseHand", name, handRaised.value).catch(() => {
      handRaised.value = !handRaised.value;
    });
  }
  return {
    channel,
    speakers,
    audience,
    me,
    muted,
    handRaised,
    joining,
    error,
    speakingUids,
    join,
    leave,
    toggleMute,
    toggleHand,
    // exposed for tests
    _internals: { upsertUser, removeUser, patchUser }
  };
}
const _hoisted_1$1 = { class: "tile__avatar" };
const _hoisted_2$1 = {
  key: 0,
  class: "tile__badge",
  title: "Muted"
};
const _hoisted_3$1 = {
  key: 1,
  class: "tile__badge",
  title: "Hand raised"
};
const _hoisted_4$1 = { class: "tile__name truncate" };
const _hoisted_5$1 = {
  key: 0,
  title: "Moderator"
};
const _hoisted_6$1 = { class: "muted truncate" };
const _sfc_main$1 = {
  __name: "SpeakerTile",
  props: {
    user: { type: Object, required: true },
    speaking: { type: Boolean, default: false }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["tile", { "tile--speaking": __props.speaking }])
      }, [
        createBaseVNode("div", _hoisted_1$1, [
          createVNode(AppAvatar, {
            user: __props.user,
            size: 76
          }, null, 8, ["user"]),
          __props.user.is_muted ? (openBlock(), createElementBlock("span", _hoisted_2$1, "🔇")) : __props.user.hand_raised ? (openBlock(), createElementBlock("span", _hoisted_3$1, "✋")) : createCommentVNode("", true)
        ]),
        createBaseVNode("span", _hoisted_4$1, [
          __props.user.is_moderator ? (openBlock(), createElementBlock("span", _hoisted_5$1, "✳️")) : createCommentVNode("", true),
          createTextVNode(" " + toDisplayString(__props.user.first_name || __props.user.name), 1)
        ]),
        createBaseVNode("small", _hoisted_6$1, "@" + toDisplayString(__props.user.username), 1)
      ], 2);
    };
  }
};
const SpeakerTile = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-cadaccf8"]]);
const _hoisted_1 = { class: "room" };
const _hoisted_2 = { class: "room__header" };
const _hoisted_3 = { class: "grow" };
const _hoisted_4 = { class: "room__topic" };
const _hoisted_5 = {
  key: 0,
  class: "muted room__silent"
};
const _hoisted_6 = { class: "room__tiles" };
const _hoisted_7 = { key: 0 };
const _hoisted_8 = { class: "room__heading" };
const _hoisted_9 = { class: "room__tiles" };
const _hoisted_10 = { class: "room__bar" };
const _hoisted_11 = ["disabled", "title"];
const _sfc_main = {
  __name: "RoomView",
  props: { channel: { type: String, required: true } },
  setup(__props) {
    const props = __props;
    const router = useRouter();
    const { state } = useSession();
    const room = useRoom();
    onMounted(async () => {
      const ok = await room.join(props.channel, {
        userId: state.user?.user_profile?.user_id,
        audioEnabled: state.settings.audioEnabled
      });
      if (!ok) {
        router.replace({ name: "home" });
      }
    });
    onUnmounted(() => room.leave());
    async function exit() {
      await room.leave();
      router.push({ name: "home" });
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        unref(room).joining.value ? (openBlock(), createBlock(AppSpinner, { key: 0 })) : unref(room).channel.info ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createBaseVNode("header", _hoisted_2, [
            createBaseVNode("div", _hoisted_3, [
              createBaseVNode("h1", _hoisted_4, toDisplayString(unref(room).channel.info.topic || "Untitled room"), 1),
              !unref(state).settings.audioEnabled ? (openBlock(), createElementBlock("p", _hoisted_5, " Audio is off — enable it in Settings to hear the room. ")) : createCommentVNode("", true)
            ]),
            createBaseVNode("button", {
              class: "btn btn-danger",
              onClick: exit
            }, "Leave quietly ✌️")
          ]),
          createBaseVNode("section", null, [
            _cache[2] || (_cache[2] = createBaseVNode("h2", { class: "room__heading" }, "Speakers", -1)),
            createBaseVNode("div", _hoisted_6, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(room).speakers.value, (user) => {
                return openBlock(), createBlock(SpeakerTile, {
                  key: user.user_id,
                  user,
                  speaking: unref(room).speakingUids.value.has(user.user_id)
                }, null, 8, ["user", "speaking"]);
              }), 128))
            ])
          ]),
          unref(room).audience.value.length ? (openBlock(), createElementBlock("section", _hoisted_7, [
            createBaseVNode("h2", _hoisted_8, "Also here (" + toDisplayString(unref(room).audience.value.length) + ")", 1),
            createBaseVNode("div", _hoisted_9, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(room).audience.value, (user) => {
                return openBlock(), createBlock(SpeakerTile, {
                  key: user.user_id,
                  user
                }, null, 8, ["user"]);
              }), 128))
            ])
          ])) : createCommentVNode("", true),
          createBaseVNode("footer", _hoisted_10, [
            createBaseVNode("button", {
              class: "btn btn-secondary",
              disabled: !unref(state).settings.audioEnabled,
              title: unref(state).settings.audioEnabled ? "" : "Audio is disabled in Settings",
              onClick: _cache[0] || (_cache[0] = ($event) => unref(room).toggleMute())
            }, toDisplayString(unref(room).muted.value ? "🔇 Muted" : "🎙️ Live"), 9, _hoisted_11),
            createBaseVNode("button", {
              class: "btn btn-secondary",
              onClick: _cache[1] || (_cache[1] = ($event) => unref(room).toggleHand())
            }, toDisplayString(unref(room).handRaised.value ? "✋ Hand raised" : "✋ Raise hand"), 1)
          ])
        ], 64)) : unref(room).error.value ? (openBlock(), createBlock(EmptyState, {
          key: 2,
          message: unref(room).error.value
        }, null, 8, ["message"])) : createCommentVNode("", true)
      ]);
    };
  }
};
const RoomView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fa4a7fcb"]]);
export {
  RoomView as default
};
