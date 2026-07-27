/**
 * The only bridge between the renderer and the outside world.
 *
 * Exposes a fixed, explicit surface - no `ipcRenderer`, no `require`, no
 * arbitrary channel names. Anything the UI can do is listed here.
 */

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
	"searchUsers",
	// clubs & events
	"getClub",
	"followClub",
	"unfollowClub",
	// rooms
	"getFeed",
	"joinChannel",
	"sendChatMessage",
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
		signIn: authResult => ipcRenderer.invoke("session:signIn", authResult),
		signOut: () => ipcRenderer.invoke("session:signOut")
	},
	settings: {
		get: () => ipcRenderer.invoke("settings:get"),
		set: patch => ipcRenderer.invoke("settings:set", patch)
	},
	platform: process.platform
});
