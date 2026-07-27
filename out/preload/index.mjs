import { contextBridge, ipcRenderer } from "electron";
const API_METHODS = [
  // auth
  "startPhoneAuth",
  "callPhoneAuth",
  "completePhoneAuth",
  "refreshToken",
  "checkWaitlistStatus",
  // me / profiles
  "me",
  "getProfile",
  "updateName",
  "updateUsername",
  "updateBio",
  // social
  "follow",
  "unfollow",
  "getFollowing",
  "getFollowers",
  "searchUsers",
  "getOnlineFriends",
  "getNotifications",
  // clubs & events
  "getClub",
  "followClub",
  "unfollowClub",
  "getEvents",
  "getEvent",
  // rooms
  "getChannels",
  "joinChannel",
  "leaveChannel",
  "activePing",
  "createChannel",
  "endChannel",
  // moderation
  "inviteSpeaker",
  "uninviteSpeaker",
  "acceptSpeakerInvite",
  "makeModerator",
  "muteSpeaker",
  "blockFromChannel",
  "raiseHand",
  // invites
  "inviteToApp",
  "inviteToExistingChannel"
];
const api = {};
for (const name of API_METHODS) {
  api[name] = (...args) => ipcRenderer.invoke(`api:${name}`, ...args);
}
contextBridge.exposeInMainWorld("clubhouse", {
  api,
  session: {
    get: () => ipcRenderer.invoke("session:get"),
    signIn: (authResult) => ipcRenderer.invoke("session:signIn", authResult),
    signOut: () => ipcRenderer.invoke("session:signOut")
  },
  settings: {
    get: () => ipcRenderer.invoke("settings:get"),
    set: (patch) => ipcRenderer.invoke("settings:set", patch)
  },
  platform: process.platform
});
