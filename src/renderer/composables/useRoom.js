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
	const everCount = ref(0);
	const error = ref("");

	const chat = reactive({ messages: [], enabled: false, canPost: false, error: "" });

	let audio = null;
	let events = null;
	let pingTimer = null;

	/** Keeps a long room from growing the list without bound. */
	const MAX_MESSAGES = 200;

	/**
	 * One chat message, in the shape the UI renders.
	 *
	 * Handles both layouts: PubNub carries the author as flat from_* fields,
	 * while a REST history is more likely to nest a user_profile. Taking either
	 * means history and live messages render identically.
	 */
	function chatEntry(raw) {
		return {
			message_id: raw.message_id,
			message: raw.message ?? raw.text,
			time_created: raw.time_created,
			user_profile: raw.user_profile || {
				user_id: raw.from_user_id,
				name: raw.from_name,
				username: raw.from_username,
				photo_url: raw.from_photo_url
			}
		};
	}

	/** Whatever key the list arrives under. */
	function messagesFrom(result) {
		return result?.messages || result?.items || result?.chat_messages || [];
	}

	/**
	 * The conversation from before you walked in. Oldest first, since the API
	 * may hand them back either way round and the panel reads downwards.
	 */
	async function loadHistory(channelName) {
		try {
			const result = await call("getChannelMessages", { channel: channelName });
			const history = messagesFrom(result).map(chatEntry);

			history.sort((a, b) => String(a.time_created ?? "").localeCompare(String(b.time_created ?? "")));

			for (const entry of history) {
				addMessage(entry);
			}

			chat.error = "";
		} catch (err) {
			// Not fatal - live messages still arrive over PubNub, so say what
			// happened and carry on rather than emptying the panel.
			chat.error = err.message;
		}
	}

	/** Long enough to cover a round trip, short enough to allow a repeat. */
	const ECHO_WINDOW_MS = 15000;

	const sameLine = (a, b) =>
		a.message === b.message && a.user_profile?.user_id === b.user_profile?.user_id;

	/**
	 * Your own message is shown the moment it is accepted, and the same message
	 * also comes back over PubNub. Either can arrive first: the echo often wins,
	 * because it is published while the send request is still resolving. So
	 * reconcile in both directions rather than only replacing a pending entry -
	 * that assumption is what made every sent message appear twice.
	 */
	function addMessage(entry, { pending = false } = {}) {
		if (entry.message_id && chat.messages.some(m => m.message_id === entry.message_id)) {
			return;
		}

		const waiting = chat.messages.findIndex(m => m.pending && sameLine(m, entry));
		if (waiting !== -1) {
			chat.messages[waiting] = { ...entry, pending: false, at: chat.messages[waiting].at };
			return;
		}

		// The echo got here first, so there is nothing to show optimistically.
		// Time-bounded, so deliberately saying the same thing again still shows.
		if (pending && chat.messages.some(m => sameLine(m, entry) && Date.now() - (m.at ?? 0) < ECHO_WINDOW_MS)) {
			return;
		}

		chat.messages.push({ ...entry, pending, at: Date.now() });

		if (chat.messages.length > MAX_MESSAGES) {
			chat.messages.splice(0, chat.messages.length - MAX_MESSAGES);
		}
	}

	async function sendChat(text) {
		const body = String(text || "").trim();
		const info = channel.info;

		if (!body || !info) {
			return false;
		}

		const meId = channel.info?.user_profile_id;

		try {
			await call("sendChatMessage", { channel: info.channel, message: body });

			addMessage(
				{
					message_id: null,
					message: body,
					user_profile: channel.users.find(u => u.user_id === meId) || { user_id: meId, name: "You" }
				},
				{ pending: true }
			);

			chat.error = "";
			return true;
		} catch (err) {
			chat.error = err.message;
			return false;
		}
	}

	const me = computed(() => channel.info?.users?.find(u => u.is_self) || null);
	const speakers = computed(() => channel.users.filter(u => u.is_speaker));
	const audience = computed(() => channel.users.filter(u => !u.is_speaker));

	/**
	 * The audience, split the way the phone app splits it. Every flag here
	 * comes from join_channel's user objects, so this is the server's own
	 * classification rather than a guess.
	 *
	 * Each person lands in exactly one group, in this order, so nobody is
	 * listed twice.
	 */
	const followedBySpeakers = computed(() => audience.value.filter(u => u.is_followed_by_speaker));

	const houseMembers = computed(() =>
		audience.value.filter(u => !u.is_followed_by_speaker && u.is_social_club_member)
	);

	const others = computed(() =>
		audience.value.filter(u => !u.is_followed_by_speaker && !u.is_social_club_member)
	);

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

			// Live chat. Found by logging the actions the old allowlist was
			// dropping - it carries the author inline, so no lookup is needed.
			events.on("new_channel_message", event => addMessage(chatEntry(event)));

			// How many people have passed through since the room opened, which
			// is a different and more interesting number than who is here now.
			events.on("cumulative_count_update", event => {
				everCount.value = event.num_ever ?? everCount.value;
			});

			await events.subscribe(info);

			pingTimer = setInterval(() => call("activePing", channelName).catch(() => {}), 30000);

			// The server says whether this room has chat and whether we may
			// post, so the UI follows its answer rather than assuming.
			chat.enabled = Boolean(info.is_room_chat_available && info.is_chat_enabled);
			chat.canPost = Boolean(info.user_capabilities?.can_post_to_chat);
			chat.messages = [];
			chat.error = "";

			if (chat.enabled) {
				// After subscribing, so anything said while this was in flight
				// still arrives; addMessage dedupes by message_id.
				await loadHistory(channelName);
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
		pingTimer = null;

		everCount.value = 0;
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
		followedBySpeakers,
		houseMembers,
		others,
		me,
		muted,
		handRaised,
		everCount,
		joining,
		error,
		speakingUids,
		join,
		leave,
		sendChat,
		toggleMute,
		toggleHand,
		// exposed for tests
		_internals: { upsertUser, removeUser, patchUser }
	};
}
