import { join } from "node:path";
import { platform } from "node:process";
import { ipcMain, Menu, app, systemPreferences, BrowserWindow, shell } from "electron";
import Store from "electron-store";
const API_ROOT = "https://www.clubhouseapi.com/api";
const APP_IDENTITY = Object.freeze({
  userAgent: "clubhouse/android",
  appVersion: "0.1.8",
  appBuild: "2576"
});
const SERVICES = Object.freeze({
  agoraAppId: "938de3e8055e42b281bb8c6f69c21f78",
  pubnubOrigin: "https://clubhouse.pubnub.com",
  pubnubPublishKey: "pub-c-6878d382-5ae6-4494-9099-f930f938868b",
  pubnubSubscribeKey: "sub-c-a4abea84-9ca3-11ea-8e71-f2b83ac9263d"
});
function newDeviceId(randomUUID = globalThis.crypto?.randomUUID) {
  if (typeof randomUUID === "function") {
    return randomUUID.call(globalThis.crypto).toUpperCase();
  }
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = bytes[6] & 15 | 64;
  bytes[8] = bytes[8] & 63 | 128;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20)
  ].join("-").toUpperCase();
}
function buildHeaders({ deviceId, userId, authToken, locale = "en_US", language = "en-US" } = {}) {
  const headers = {
    "User-Agent": APP_IDENTITY.userAgent,
    "CH-Languages": language,
    "CH-Locale": locale,
    "CH-AppVersion": APP_IDENTITY.appVersion,
    "CH-AppBuild": APP_IDENTITY.appBuild,
    "CH-DeviceId": deviceId || "(null)",
    "CH-UserID": userId == null ? "(null)" : String(userId),
    Accept: "application/json",
    "Accept-Language": "en-US;q=1"
  };
  if (authToken) {
    headers.Authorization = `Token ${authToken}`;
  }
  return headers;
}
class Session {
  constructor(store = new Store({ name: "session" })) {
    this.store = store;
    if (!this.store.get("deviceId")) {
      this.store.set("deviceId", newDeviceId());
    }
  }
  get deviceId() {
    return this.store.get("deviceId");
  }
  /** Shape the API client asks for on every request. */
  credentials() {
    const user = this.store.get("user");
    return {
      deviceId: this.deviceId,
      userId: user?.user_profile?.user_id,
      authToken: user?.auth_token
    };
  }
  get user() {
    return this.store.get("user") || null;
  }
  isSignedIn() {
    return Boolean(this.store.get("user")?.auth_token);
  }
  signIn(authResult) {
    this.store.set("user", authResult);
  }
  signOut() {
    this.store.delete("user");
  }
  /** Merge fresh tokens from /refresh_token without losing the profile. */
  updateTokens({ access, refresh }) {
    const user = this.user;
    if (!user) {
      return;
    }
    this.store.set("user", {
      ...user,
      access_token: access ?? user.access_token,
      refresh_token: refresh ?? user.refresh_token
    });
  }
}
const DEFAULTS = {
  theme: "auto",
  country: "US",
  filterNonLatinRooms: false,
  /** Audio is opt-in: see src/renderer/audio for why. */
  audioEnabled: false,
  windowState: { width: 1100, height: 800, maximized: false }
};
class Settings {
  constructor(store = new Store({ name: "settings", defaults: DEFAULTS })) {
    this.store = store;
  }
  all() {
    return { ...DEFAULTS, ...this.store.store };
  }
  get(key) {
    return this.store.get(key, DEFAULTS[key]);
  }
  update(patch = {}) {
    for (const [key, value] of Object.entries(patch)) {
      this.store.set(key, value);
    }
    return this.all();
  }
}
class ApiError extends Error {
  constructor(message, { status, endpoint, body } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.endpoint = endpoint;
    this.body = body;
  }
}
const defaultTransport = (url, options) => globalThis.fetch(url, options);
class ClubhouseClient {
  /**
   * @param {object} opts
   * @param {() => object} opts.getSession returns { deviceId, userId, authToken }
   * @param {Function} [opts.transport] fetch-compatible
   * @param {string}   [opts.apiRoot]
   * @param {Function} [opts.onRequest] observer for logging
   */
  constructor({ getSession, transport = defaultTransport, apiRoot = API_ROOT, onRequest } = {}) {
    this.getSession = getSession || (() => ({}));
    this.transport = transport;
    this.apiRoot = apiRoot;
    this.onRequest = onRequest;
  }
  /**
   * @param {string} endpoint e.g. "/get_channels"
   * @param {object} [opts]
   * @param {object} [opts.body]  present => POST
   * @param {object} [opts.query] appended as a querystring
   */
  async request(endpoint, { body, query } = {}) {
    let url = this.apiRoot + endpoint;
    if (query) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(query)) {
        if (value !== void 0 && value !== null) {
          params.append(key, String(value));
        }
      }
      const qs = params.toString();
      if (qs) {
        url += `?${qs}`;
      }
    }
    const method = body === void 0 ? "GET" : "POST";
    const headers = buildHeaders(this.getSession());
    const options = { method, headers };
    if (body !== void 0) {
      headers["Content-Type"] = "application/json; charset=utf-8";
      options.body = JSON.stringify(body);
    }
    this.onRequest?.({ phase: "request", method, url, body });
    let response;
    try {
      response = await this.transport(url, options);
    } catch (cause) {
      throw new ApiError(`Could not reach Clubhouse: ${cause.message}`, { endpoint });
    }
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new ApiError("Clubhouse returned a response that was not JSON", {
        status: response.status,
        endpoint,
        body: text.slice(0, 200)
      });
    }
    this.onRequest?.({ phase: "response", method, url, status: response.status, data });
    if (!response.ok) {
      throw new ApiError(data.error_message || `Request failed with HTTP ${response.status}`, {
        status: response.status,
        endpoint,
        body: data
      });
    }
    return data;
  }
}
const endpoints = {
  // --- auth ---------------------------------------------------------
  startPhoneAuth: (c, phoneNumber) => c.request("/start_phone_number_auth", { body: { phone_number: phoneNumber } }),
  callPhoneAuth: (c, phoneNumber) => c.request("/call_phone_number_auth", { body: { phone_number: phoneNumber } }),
  completePhoneAuth: (c, phoneNumber, verificationCode) => c.request("/complete_phone_number_auth", {
    body: { phone_number: phoneNumber, verification_code: verificationCode }
  }),
  refreshToken: (c, refresh) => c.request("/refresh_token", { body: { refresh } }),
  checkWaitlistStatus: (c) => c.request("/check_waitlist_status", { body: {} }),
  // --- me / profiles ------------------------------------------------
  me: (c) => c.request("/me", {
    body: { return_blocked_ids: true, return_following_ids: true }
  }),
  getProfile: (c, userId) => c.request("/get_profile", { body: { user_id: userId } }),
  updateName: (c, name) => c.request("/update_name", { body: { name } }),
  updateUsername: (c, username) => c.request("/update_username", { body: { username } }),
  updateBio: (c, bio) => c.request("/update_bio", { body: { bio } }),
  // --- social -------------------------------------------------------
  follow: (c, userId) => c.request("/follow", { body: { user_id: userId, source: 4 } }),
  unfollow: (c, userId) => c.request("/unfollow", { body: { user_id: userId } }),
  getFollowing: (c, userId, { page = 1, pageSize = 50 } = {}) => c.request("/get_following", { query: { user_id: userId, page, page_size: pageSize } }),
  getFollowers: (c, userId, { page = 1, pageSize = 50 } = {}) => c.request("/get_followers", { query: { user_id: userId, page, page_size: pageSize } }),
  searchUsers: (c, query) => c.request("/search_users", {
    body: { query, cofollows_only: false, followers_only: false, following_only: false }
  }),
  getOnlineFriends: (c) => c.request("/get_online_friends", { body: {} }),
  getNotifications: (c, { page = 1, pageSize = 20 } = {}) => c.request("/get_notifications", { query: { page, page_size: pageSize } }),
  // --- clubs & events -----------------------------------------------
  getClub: (c, clubId) => c.request("/get_club", { body: { club_id: clubId } }),
  followClub: (c, clubId) => c.request("/follow_club", { body: { club_id: clubId } }),
  unfollowClub: (c, clubId) => c.request("/unfollow_club", { body: { club_id: clubId } }),
  getEvents: (c, { page = 1, pageSize = 25 } = {}) => c.request("/get_events", { query: { page, page_size: pageSize } }),
  getEvent: (c, eventHashid) => c.request("/get_event", { body: { event_hashid: eventHashid } }),
  // --- rooms --------------------------------------------------------
  getChannels: (c) => c.request("/get_channels", { body: {} }),
  joinChannel: (c, channel) => c.request("/join_channel", {
    body: { channel, attribution_source: "feed", attribution_details: "e30=" }
  }),
  leaveChannel: (c, channel) => c.request("/leave_channel", { body: { channel, channel_id: null } }),
  activePing: (c, channel) => c.request("/active_ping", { body: { channel, channel_id: null } }),
  createChannel: (c, { topic = "", userIds = [], isPrivate = false, isSocialMode = false } = {}) => c.request("/create_channel", {
    body: {
      topic,
      user_ids: userIds,
      is_private: isPrivate,
      is_social_mode: isSocialMode
    }
  }),
  endChannel: (c, channel) => c.request("/end_channel", { body: { channel } }),
  // --- room moderation ----------------------------------------------
  inviteSpeaker: (c, channel, userId) => c.request("/invite_speaker", { body: { channel, user_id: userId } }),
  uninviteSpeaker: (c, channel, userId) => c.request("/uninvite_speaker", { body: { channel, user_id: userId } }),
  acceptSpeakerInvite: (c, channel, userId) => c.request("/accept_speaker_invite", { body: { channel, user_id: userId } }),
  makeModerator: (c, channel, userId) => c.request("/make_moderator", { body: { channel, user_id: userId } }),
  muteSpeaker: (c, channel, userId) => c.request("/mute_speaker", { body: { channel, user_id: userId } }),
  blockFromChannel: (c, channel, userId) => c.request("/block_from_channel", { body: { channel, user_id: userId } }),
  raiseHand: (c, channel, raise = true) => c.request("/audience_reply", {
    body: { channel, raise_hands: raise, unraise_hands: !raise }
  }),
  // --- invites ------------------------------------------------------
  inviteToApp: (c, name, phoneNumber) => c.request("/invite_to_app", { body: { name, phone_number: phoneNumber } }),
  inviteToExistingChannel: (c, channel, userId) => c.request("/invite_to_existing_channel", { body: { channel, user_id: userId } })
};
function registerIpc({ session, settings, verbose = false }) {
  const client = new ClubhouseClient({
    getSession: () => session.credentials(),
    onRequest: verbose ? (event) => {
      if (event.phase === "request") {
        console.log(`[api] -> ${event.method} ${event.url}`, redact(event.body));
      } else {
        console.log(`[api] <- ${event.status} ${event.url}`, redact(event.data));
      }
    } : void 0
  });
  for (const [name, fn] of Object.entries(endpoints)) {
    ipcMain.handle(`api:${name}`, async (_event, ...args) => {
      try {
        const data = await fn(client, ...args);
        return { ok: true, data };
      } catch (error) {
        return {
          ok: false,
          error: { message: error.message, status: error.status ?? null }
        };
      }
    });
  }
  ipcMain.handle("session:get", () => ({
    signedIn: session.isSignedIn(),
    user: session.user,
    services: SERVICES
  }));
  ipcMain.handle("session:signIn", (_event, authResult) => {
    session.signIn(authResult);
    return { ok: true };
  });
  ipcMain.handle("session:signOut", () => {
    session.signOut();
    return { ok: true };
  });
  ipcMain.handle("settings:get", () => settings.all());
  ipcMain.handle("settings:set", (_event, patch) => settings.update(patch));
}
function redact(value) {
  if (!value || typeof value !== "object") {
    return value;
  }
  const clone = Array.isArray(value) ? [...value] : { ...value };
  for (const key of ["auth_token", "access_token", "refresh_token", "token", "rtm_token", "pubnub_token"]) {
    if (key in clone) {
      clone[key] = "<redacted>";
    }
  }
  return clone;
}
const REPO = "https://github.com/jodle001/clubhouse-desktop";
function buildMenu({ app: app2, shell: shell2 }) {
  const isMac = platform === "darwin";
  const template = [
    ...isMac ? [
      {
        label: app2.name,
        submenu: [
          { role: "about" },
          { type: "separator" },
          { role: "services" },
          { type: "separator" },
          { role: "hide" },
          { role: "hideOthers" },
          { type: "separator" },
          { role: "quit" }
        ]
      }
    ] : [],
    {
      label: "File",
      submenu: [isMac ? { role: "close" } : { role: "quit" }]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    {
      role: "help",
      submenu: [
        {
          label: "Project on GitHub",
          click: () => shell2.openExternal(REPO)
        }
      ]
    }
  ];
  return Menu.buildFromTemplate(template);
}
const VERBOSE = process.argv.includes("--verbose");
if (platform === "linux") {
  app.commandLine.appendSwitch("disable-features", "MediaSessionService");
}
app.setAppUserModelId("com.jodle001.clubhouse-desktop");
let mainWindow = null;
function createWindow(settings) {
  const state = settings.get("windowState");
  const win = new BrowserWindow({
    width: state.width,
    height: state.height,
    minWidth: 900,
    minHeight: 560,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: platform === "darwin" ? "hiddenInset" : "default",
    backgroundColor: "#e9e7e3",
    icon: join(import.meta.dirname, "../../resources/icon.png"),
    webPreferences: {
      preload: join(import.meta.dirname, "../preload/index.mjs"),
      // The renderer is pure UI. No Node, no direct network, no tokens.
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  if (state.maximized) {
    win.maximize();
  }
  win.on("ready-to-show", () => win.show());
  win.on("close", () => {
    const bounds = win.getBounds();
    settings.update({
      windowState: {
        width: bounds.width,
        height: bounds.height,
        maximized: win.isMaximized()
      }
    });
  });
  win.on("closed", () => {
    mainWindow = null;
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  if (VERBOSE) {
    const levels = ["debug", "info", "warning", "error"];
    win.webContents.on("console-message", (_event, level, message, line, source) => {
      console.log(`[renderer:${levels[level] || level}] ${message}  (${source}:${line})`);
    });
    win.webContents.on(
      "render-process-gone",
      (_event, details) => console.log("[renderer gone]", JSON.stringify(details))
    );
  }
  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    win.loadFile(join(import.meta.dirname, "../renderer/index.html"));
  }
  return win;
}
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });
  app.whenReady().then(async () => {
    const session = new Session();
    const settings = new Settings();
    registerIpc({ session, settings, verbose: VERBOSE });
    Menu.setApplicationMenu(buildMenu({ app, shell }));
    if (platform === "darwin") {
      systemPreferences.askForMediaAccess("microphone").catch(() => {
      });
    }
    mainWindow = createWindow(settings);
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = createWindow(settings);
      }
    });
  });
  app.on("window-all-closed", () => {
    if (platform !== "darwin") {
      app.quit();
    }
  });
}
