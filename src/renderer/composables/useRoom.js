import { computed, reactive, ref } from "vue";
import { call } from "./useApi.js";
import { createAudioEngine } from "../audio/index.js";
import { createRoomEvents } from "../room/index.js";
import { SERVICES } from "@shared/profile.js";

/**
 * Everything about being in a room, with audio and live events injectable so
 * the whole flow can be tested without an SDK or a socket.
 */
export function useRoom({ makeAudio = createAudioEngine, makeEvents = createRoomEvents } = {}) {
	const channel = reactive({ info: null, users: [] });
	const speakingUids = ref(new Set());
	const muted = ref(true);
	const handRaised = ref(false);
	const joining = ref(false);
	const error = ref("");

	const chat = reactive({ messages: [], enabled: false, canPost: false, error: "" });

	let audio = null;
	let events = null;
	let pingTimer = null;
	let chatTimer = null;

	/**
	 * Message lists come back oldest-first or newest-first depending on the
	 * endpoint, and under more than one key. Take what is there.
	 */
	function messagesFrom(result) {
		return result?.messages || result?.items || result?.chat_messages || [];
	}

	async function loadChat() {
		const info = channel.info;
		if (!info || !chat.enabled) {
			return;
		}

		try {
			const result = await call("getChatMessages", {
				channel: info.channel,
				channelId: info.channel_id
			});

			chat.messages = messagesFrom(result);
			chat.error = "";
		} catch (err) {
			// Reported once, in place, rather than as a toast every poll.
			chat.error = err.message;
		}
	}

	async function sendChat(text) {
		const body = String(text || "").trim();
		const info = channel.info;

		if (!body || !info) {
			return false;
		}

		try {
			await call("sendChatMessage", { channel: info.channel, message: body });
			await loadChat();
			return true;
		} catch (err) {
			chat.error = err.message;
			return false;
		}
	}

	const me = computed(() => channel.info?.users?.find(u => u.is_self) || null);
	const speakers = computed(() => channel.users.filter(u => u.is_speaker));
	const audience = computed(() => channel.users.filter(u => !u.is_speaker));

	function upsertUser(user) {
		const index = channel.users.findIndex(u => u.user_id === user.user_id);
		if (index === -1) {
			channel.users.push(user);
		} else {
			channel.users[index] = { ...channel.users[index], ...user };
		}
	}

	function removeUser(userId) {
		const index = channel.users.findIndex(u => u.user_id === userId);
		if (index !== -1) {
			channel.users.splice(index, 1);
		}
	}

	function patchUser(userId, patch) {
		const user = channel.users.find(u => u.user_id === userId);
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

			audio.on("speaking", list => {
				speakingUids.value = new Set(list.map(entry => Number(entry.uid)));
			});

			events = await makeEvents({
				publishKey: SERVICES.pubnubPublishKey,
				subscribeKey: SERVICES.pubnubSubscribeKey,
				userId,
				log: console.log
			});

			events.on("join_channel", message => upsertUser(message.user_profile));
			events.on("leave_channel", message => removeUser(message.user_id));
			events.on("add_speaker", message => patchUser(message.user_id, { is_speaker: true }));
			events.on("remove_speaker", message => patchUser(message.user_id, { is_speaker: false }));
			events.on("make_moderator", message => patchUser(message.user_id, { is_moderator: true }));
			events.on("raise_hands", message => patchUser(message.user_id, { hand_raised: true }));
			events.on("unraise_hands", message => patchUser(message.user_id, { hand_raised: false }));
			events.on("end_channel", () => leave());

			await events.subscribe(info);

			pingTimer = setInterval(() => call("activePing", channelName).catch(() => {}), 30000);

			// The server says whether this room has chat and whether we may
			// post, so the UI follows its answer rather than assuming.
			chat.enabled = Boolean(info.is_room_chat_available && info.is_chat_enabled);
			chat.canPost = Boolean(info.user_capabilities?.can_post_to_chat);
			chat.messages = [];
			chat.error = "";

			if (chat.enabled) {
				await loadChat();
				// Polled, because the PubNub action carrying live messages is
				// not known yet - unhandled actions are logged now, so the next
				// session in a chatty room should name it.
				chatTimer = setInterval(loadChat, 10000);
			}

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
		clearInterval(chatTimer);
		pingTimer = null;
		chatTimer = null;

		chat.messages = [];
		chat.enabled = false;
		chat.canPost = false;
		chat.error = "";

		const name = channel.info?.channel;

		await events?.unsubscribe();
		await audio?.destroy();
		events = null;
		audio = null;

		if (name) {
			await call("leaveChannel", name).catch(() => {});
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
		chat,
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
		loadChat,
		sendChat,
		toggleMute,
		toggleHand,
		// exposed for tests
		_internals: { upsertUser, removeUser, patchUser }
	};
}
