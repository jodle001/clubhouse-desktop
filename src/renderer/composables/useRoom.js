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
	/** A moderator's invitation to speak, until answered. */
	const invite = ref(null);
	const error = ref("");
	/**
	 * Anything the microphone refused to do. Separate from `error`, which means
	 * "there is no room"; this one is shown while the room is perfectly fine and
	 * only the audio is not.
	 */
	const audioError = ref("");

	const chat = reactive({
		messages: [],
		enabled: false,
		canPost: false,
		error: "",
		/** Cursor into older history; null once the beginning is reached. */
		nextCursor: null,
		total: 0,
		loadingOlder: false
	});

	/**
	 * Reactions floating over the room right now: { id, userId, emoji, gif }.
	 * An entry carries an emoji or a GIF url, and removes itself after its
	 * display time, like the phone app's ticker.
	 */
	const reactions = ref([]);
	/** What this room lets people send, from join_channel. */
	const reactionOptions = ref([]);
	/** Set once the server refuses on a feature flag, so the picker retires. */
	const reactionsBlocked = ref(false);

	const REACTION_MS = 4000;
	/** However long an event asks for, a reaction is not a billboard. */
	const REACTION_MAX_MS = 30000;
	let reactionSeq = 0;
	let loggedReactionEvent = false;
	const reactionTimers = new Set();

	function showReaction(userId, { emoji = null, gif = null } = {}, ms = REACTION_MS) {
		if (!emoji && !gif) {
			return;
		}

		const id = ++reactionSeq;
		// Latest wins per person, so a burst does not stack badges.
		reactions.value = [...reactions.value.filter(r => r.userId !== userId), { id, userId, emoji, gif }];

		const timer = setTimeout(() => {
			reactionTimers.delete(timer);
			reactions.value = reactions.value.filter(r => r.id !== id);
		}, Math.min(ms || REACTION_MS, REACTION_MAX_MS));
		reactionTimers.add(timer);
	}

	/** The reaction to draw on this person's tile - { emoji, gif } - if any. */
	function reactionFor(userId) {
		return reactions.value.find(r => r.userId === userId) || null;
	}

	/**
	 * React with an emoji, onto somebody's tile - your own unless a target is
	 * given, which is where the phone app draws a plain reaction.
	 */
	async function sendReaction(option, targetUserId = null) {
		const info = channel.info;
		if (!info || !option) {
			return false;
		}

		const target = targetUserId ?? info.user_profile_id;

		try {
			// The id when the room supplied one; the emoji as a last resort, so
			// a shape this parser has not met still produces a server error
			// that names what it wanted rather than a dead button.
			await call("sendChannelReaction", info.channel, option.id ?? option.emoji, target);
			// The PubNub echo is neither guaranteed nor instant - showing it
			// now is what makes the button feel like it did something.
			// showReaction dedupes per person.
			showReaction(target, { emoji: option.emoji });
			return true;
		} catch (err) {
			// "Feature flag is not enabled" is not the payload (the server
			// validated reaction_id and target_user_id first) and not the
			// account either - the same account reacts fine from the phone
			// app. It fails under both Android identities this client can
			// claim, so the server is deciding by what the client says it is;
			// npm run probe:react walks the identity ladder to find which
			// claim passes. Until then, say so once and retire the picker for
			// this room rather than failing on every press.
			if (/feature flag/i.test(err.message)) {
				chat.error = "Clubhouse refuses reactions from this client identity (the account is fine).";
				reactionsBlocked.value = true;
			} else {
				chat.error = err.message;
			}
			return false;
		}
	}

	/**
	 * The room's palette, as { id, emoji }. join_channel carries it twice:
	 * emoji_reactions.channel_reactions is bare emoji strings, and
	 * reactions.channel_reactions is objects carrying the reaction_id that
	 * /send_channel_reaction demands ("Reaction id is required." when sent the
	 * emoji itself). Field names inside those objects are taken defensively,
	 * since they are known only from observation.
	 */
	function parseReactionOptions(info) {
		const rich = info.reactions?.channel_reactions;

		if (Array.isArray(rich) && rich.length && typeof rich[0] === "object") {
			// One line so a verbose log records the true shape.
			console.log("[room] reaction option shape:", JSON.stringify(rich[0]));

			return rich
				.map(r => ({
					id: r.reaction_id ?? r.id ?? null,
					emoji: r.emoji ?? r.reaction ?? r.display_emoji ?? r.name ?? null
				}))
				.filter(r => r.emoji);
		}

		const plain = info.emoji_reactions?.channel_reactions || info.emoji_reaction_options || [];
		return plain.map(emoji => ({ id: null, emoji }));
	}

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
			like_count: raw.like_count ?? 0,
			viewer_has_liked: Boolean(raw.viewer_has_liked),
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

	const byTime = (a, b) => (Date.parse(a.time_created) || 0) - (Date.parse(b.time_created) || 0);

	/**
	 * The conversation from before you walked in. Oldest first, since the API
	 * may hand them back either way round and the panel reads downwards.
	 */
	async function loadHistory(channelName) {
		try {
			const result = await call("getChannelMessages", { channel: channelName });
			const history = messagesFrom(result).map(chatEntry);

			// As times, not strings: the API sends offsets ('...-07:00'), and
			// lexicographic order is only chronological while every stamp
			// happens to share one.
			history.sort(byTime);

			for (const entry of history) {
				addMessage(entry);
			}

			chat.nextCursor = result?.next_cursor || null;
			chat.total = result?.num_messages ?? history.length;
			chat.error = "";
		} catch (err) {
			// Not fatal - live messages still arrive over PubNub, so say what
			// happened and carry on rather than emptying the panel.
			chat.error = err.message;
		}
	}

	/**
	 * One more page of the past, on demand. The API pages newest-first, so a
	 * continued cursor yields strictly older messages, which prepend.
	 */
	async function loadOlder() {
		const name = channel.info?.channel;
		if (!name || !chat.nextCursor || chat.loadingOlder) {
			return false;
		}

		chat.loadingOlder = true;

		try {
			const result = await call("getChannelMessages", { channel: name, cursor: chat.nextCursor });
			const seen = new Set(chat.messages.map(m => m.message_id).filter(Boolean));
			const older = messagesFrom(result)
				.map(chatEntry)
				.filter(m => m.message_id && !seen.has(m.message_id));

			older.sort(byTime);
			// Deliberately not through addMessage: this is the past, so it
			// goes before what is shown, and the newest-200 cap must not eat
			// what was just fetched.
			chat.messages.unshift(...older.map(m => ({ ...m, at: 0 })));

			// A cursor that stopped yielding anything new is the end too -
			// trusting it forever would let one repeated page loop.
			chat.nextCursor = older.length ? result?.next_cursor || null : null;
			return older.length > 0;
		} catch (err) {
			chat.error = err.message;
			return false;
		} finally {
			chat.loadingOlder = false;
		}
	}

	/**
	 * Like or unlike one line of chat. Optimistic, because the round trip is
	 * long enough to make a heart that lights up a second later feel broken.
	 */
	async function toggleMessageLike(message) {
		const name = channel.info?.channel;
		if (!name || !message?.message_id) {
			return false;
		}

		const wanted = !message.viewer_has_liked;
		message.viewer_has_liked = wanted;
		message.like_count = Math.max(0, (message.like_count || 0) + (wanted ? 1 : -1));

		try {
			await call(wanted ? "likeChatMessage" : "unlikeChatMessage", name, message.message_id);
			return true;
		} catch (err) {
			// Put it back the way it was; the server did not agree.
			message.viewer_has_liked = !wanted;
			message.like_count = Math.max(0, (message.like_count || 0) + (wanted ? -1 : 1));
			chat.error = err.message;
			return false;
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

	// By id, off the live list. There is no is_self flag in the real response -
	// join_channel names you once, as user_profile_id.
	const me = computed(
		() => channel.users.find(u => u.user_id === channel.info?.user_profile_id) || null
	);

	/**
	 * Read off the live user list rather than the join response, so a promotion
	 * or a demotion during the room moves it. Only a speaker may publish, so
	 * this is what decides whether the microphone button can do anything.
	 */
	const isSpeaker = computed(() =>
		Boolean(channel.users.find(u => u.user_id === channel.info?.user_profile_id)?.is_speaker)
	);

	const speakers = computed(() => channel.users.filter(u => u.is_speaker));
	const audience = computed(() => channel.users.filter(u => !u.is_speaker));

	/** Whether you can moderate this room - your own record says so. */
	const canModerate = computed(() => Boolean(me.value?.is_moderator));

	/** The room's grant of what you may do, from join_channel. */
	const capabilities = computed(() => channel.info?.user_capabilities || {});

	/** A moderator action gone wrong, shown where the action was taken. */
	const modError = ref("");

	/**
	 * One moderator verb against one person: call it, and on success patch the
	 * local record so the tiles move at once. Every one takes (channel, user_id),
	 * the shape the probe settled.
	 */
	async function moderate(method, userId, patch) {
		const name = channel.info?.channel;
		if (!name) {
			return false;
		}

		modError.value = "";

		try {
			await call(method, name, userId);
			if (patch) {
				patchUser(userId, patch);
			}
			return true;
		} catch (err) {
			modError.value = err.message;
			return false;
		}
	}

	const inviteToSpeak = userId => moderate("inviteSpeaker", userId, { is_invited_as_speaker: true });
	const moveToAudience = userId => moderate("uninviteSpeaker", userId, { is_speaker: false });
	const mutePeer = userId => moderate("muteSpeaker", userId, { is_muted: true });
	const makeMod = userId => moderate("makeModerator", userId, { is_moderator: true });

	/**
	 * Leave the stage yourself. There is no self-service verb in the API's own
	 * vocabulary, but uninvite_speaker takes a user id, so aiming it at your own
	 * is the likeliest way down. Mirrors what remove_speaker does to you: mute,
	 * drop to audience, and if it is refused, say so rather than leaving you
	 * looking demoted when you are not.
	 */
	async function stepDown() {
		const info = channel.info;
		if (!info || !isSpeaker.value) {
			return false;
		}

		modError.value = "";

		try {
			await call("uninviteSpeaker", info.channel, info.user_profile_id);
			patchUser(info.user_profile_id, { is_speaker: false });
			await audio?.setMuted(true);
			await audio?.setRole("audience");
			muted.value = true;
			return true;
		} catch (err) {
			modError.value = err.message;
			return false;
		}
	}

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

			// Already on stage, so publish rights are needed from the start.
			if ((info.users || []).find(u => u.user_id === info.user_profile_id)?.is_speaker) {
				await audio.setRole("host");
			}

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
			events.on("add_speaker", async message => {
				patchUser(message.user_id, { is_speaker: true });

				if (message.user_id === info.user_profile_id) {
					try {
						await audio?.setRole("host");
					} catch (err) {
						// The stage promotion stands either way; only the audio
						// side failed, and an emitter has nowhere to put a
						// rejection.
						audioError.value = err.message;
					}

					invite.value = null;
					// You are up; the hand has served its purpose.
					handRaised.value = false;
				}
			});

			events.on("remove_speaker", async message => {
				patchUser(message.user_id, { is_speaker: false });

				// Taken off stage: drop back to audience and stop publishing,
				// rather than holding a live microphone nobody can hear.
				if (message.user_id === info.user_profile_id) {
					try {
						await audio?.setMuted(true);
						await audio?.setRole("audience");
					} catch (err) {
						audioError.value = err.message;
					}

					muted.value = true;
				}
			});
			events.on("make_moderator", message => patchUser(message.user_id, { is_moderator: true }));
			events.on("raise_hands", message => patchUser(message.user_id, { hand_raised: true }));
			events.on("unraise_hands", message => patchUser(message.user_id, { hand_raised: false }));
			events.on("end_channel", () => leave());

			// Live chat. Found by logging the actions the old allowlist was
			// dropping - it carries the author inline, so no lookup is needed.
			events.on("new_channel_message", event => addMessage(chatEntry(event)));

			events.on("channel_message_like_count_update", event => {
				const message = chat.messages.find(m => m.message_id === event.message_id);
				if (message) {
					message.like_count = event.like_count;
				}
			});

			/**
			 * Somebody reacting with an emoji. Found the same way as live chat:
			 * it was arriving and being logged as unhandled. The live shape
			 * (from logging it) carries `reaction` as an object -
			 * { id, emoji, display_time_s, ... } - plus an action_user_profile
			 * (who reacted) and a target_user_profile (whom at). The phone app
			 * draws it on the target's tile, which is also where sending one
			 * puts it; older/flat field names are kept as fallbacks against a
			 * shape that changes under us.
			 */
			events.on("new_channel_reaction", event => {
				if (!loggedReactionEvent) {
					loggedReactionEvent = true;
					console.log("[room] reaction event shape:", JSON.stringify(event).slice(0, 600));
				}

				const detail = typeof event.reaction === "object" && event.reaction !== null ? event.reaction : null;

				showReaction(
					event.target_user_profile?.id ??
						event.target_user_id ??
						event.action_user_profile?.id ??
						event.from_user_id ??
						event.user_id ??
						event.user_profile?.user_id,
					{ emoji: detail?.emoji ?? (detail ? null : event.reaction) ?? event.emoji ?? event.reaction_emoji },
					detail?.display_time_s ? detail.display_time_s * 1000 : REACTION_MS
				);
			});

			/**
			 * A Giphy reaction - { user_id, giphy_id, display_time_s }, found in
			 * the unhandled-action log. The id is enough to build a media url,
			 * drawn over the sender's tile for as long as the event asks.
			 */
			events.on("gif_reaction", event => {
				if (!event.giphy_id) {
					return;
				}

				showReaction(
					event.target_user_profile?.id ?? event.target_user_id ?? event.user_id,
					{ gif: `https://media.giphy.com/media/${event.giphy_id}/200w.gif` },
					event.display_time_s ? event.display_time_s * 1000 : REACTION_MS
				);
			});

			/**
			 * A moderator inviting you onto the stage. This was being dropped
			 * silently, so raising a hand and being brought up looked exactly
			 * like raising a hand and being ignored.
			 */
			events.on("invite_speaker", event => {
				invite.value = { fromName: event.from_name, fromUserId: event.from_user_id };
			});

			// How many people have passed through since the room opened, which
			// is a different and more interesting number than who is here now.
			events.on("cumulative_count_update", event => {
				everCount.value = event.num_ever ?? everCount.value;
			});

			await events.subscribe(info);

			// The ping's answer matters: should_leave is the server removing you
			// - signed in elsewhere, or the room closed without an end_channel
			// event reaching us. Ignoring it meant sitting in a dead room
			// pinging it forever.
			pingTimer = setInterval(async () => {
				try {
					const pong = await call("activePing", channelName);
					if (pong?.should_leave) {
						await leave();
					}
				} catch {
					// A missed ping is not worth leaving over; the next one is
					// thirty seconds away.
				}
			}, 30000);

			// The server says whether this room has chat and whether we may
			// post, so the UI follows its answer rather than assuming.
			// An invitation from before this session. join_channel marks it on
			// your own user record, so joining a room where a moderator already
			// beckoned still shows it - the PubNub event only fires once, live.
			const mine = (info.users || []).find(u => u.user_id === info.user_profile_id);
			if (mine?.is_invited_as_speaker && !mine.is_speaker) {
				invite.value = { fromName: "", fromUserId: null };
			}

			chat.enabled = Boolean(info.is_room_chat_available && info.is_chat_enabled);
			chat.canPost = Boolean(info.user_capabilities?.can_post_to_chat);
			chat.messages = [];
			chat.error = "";
			chat.nextCursor = null;
			chat.total = 0;

			reactionOptions.value = parseReactionOptions(info);

			if (chat.enabled) {
				// After subscribing, so anything said while this was in flight
				// still arrives; addMessage dedupes by message_id.
				await loadHistory(channelName);
			}

			return true;
		} catch (err) {
			// join_channel may have succeeded before audio or events failed, in
			// which case the server has us in the room. Withdraw properly
			// rather than leaving a ghost that lingers until the ping times out.
			await leave().catch(() => {});
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
		invite.value = null;
		audioError.value = "";
		chat.messages = [];
		chat.enabled = false;
		chat.canPost = false;
		chat.error = "";
		chat.nextCursor = null;
		chat.total = 0;

		for (const timer of reactionTimers) {
			clearTimeout(timer);
		}
		reactionTimers.clear();
		reactions.value = [];
		reactionOptions.value = [];
		reactionsBlocked.value = false;
		loggedReactionEvent = false;

		const name = channel.info?.channel;

		// Each teardown independently: a PubNub unsubscribe that throws must
		// not leave the microphone live - leaving is the one flow that has to
		// finish, because logout runs right behind it.
		await events?.unsubscribe().catch(() => {});
		await audio?.destroy().catch(() => {});
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

		try {
			await audio.setMuted(!muted.value);
			audioError.value = "";
		} catch (err) {
			// Unmuting can fail for reasons the button cannot show by itself -
			// no microphone permission, or no publish rights yet. Left
			// unhandled this rejected silently and `muted` never moved, so the
			// button looked broken rather than refused.
			audioError.value = err.message;
		}

		muted.value = audio.isMuted();
	}

	/**
	 * Take the stage. The invite names who sent it, but the call is about us -
	 * it is our own user id that moves from audience to speaker.
	 */
	async function acceptInvite() {
		const info = channel.info;
		if (!info || !invite.value) {
			return false;
		}

		const meId = info.user_profile_id;

		try {
			const result = await call("becomeSpeaker", info.channel);
			patchUser(meId, { is_speaker: true });

			// Clubhouse issues an Agora token per role, and hands the publisher
			// one back from this call. Keeping the listener token from
			// join_channel is why unmuting failed with "haven't joined yet" -
			// the role changed here and the credential did not.
			await audio?.renewToken(result?.token);

			// Agora's live mode starts everybody as audience, which cannot
			// publish - so without this the microphone would stay silent no
			// matter what the button said.
			await audio?.setRole("host");

			// The server says whether to arrive muted. It always has so far,
			// and walking onto a stage with a live microphone is the wrong
			// default anyway.
			if (result?.should_join_muted !== false) {
				await audio?.setMuted(true);
				muted.value = true;
			}

			handRaised.value = false;
			invite.value = null;
			return true;
		} catch (err) {
			// Reported on the invitation itself. `error` is only rendered when
			// there is no room at all, so putting it there meant a failed accept
			// looked like nothing happening.
			invite.value = { ...invite.value, error: err.message };
			return false;
		}
	}

	/** Nothing to tell the server: the invite simply goes unanswered. */
	function declineInvite() {
		invite.value = null;
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
		isSpeaker,
		canModerate,
		capabilities,
		modError,
		inviteToSpeak,
		moveToAudience,
		mutePeer,
		makeMod,
		stepDown,
		muted,
		handRaised,
		everCount,
		invite,
		joining,
		error,
		audioError,
		speakingUids,
		join,
		leave,
		sendChat,
		loadOlder,
		toggleMessageLike,
		reactionOptions,
		reactionsBlocked,
		reactionFor,
		sendReaction,
		acceptInvite,
		declineInvite,
		toggleMute,
		toggleHand,
		// exposed for tests
		_internals: { upsertUser, removeUser, patchUser }
	};
}

/**
 * The one room the app is in, shared by every view.
 *
 * The room used to belong to RoomView, whose unmount hung up the call - so
 * opening Settings, a profile or the hallway kicked you out. State that must
 * outlive navigation cannot live in a component; this is the same shape as
 * useSession's module singleton, created lazily so importing this file (as
 * tests do, with injected fakes) never constructs an engine.
 */
let shared = null;

export function useSharedRoom() {
	if (!shared) {
		shared = useRoom();
	}

	return shared;
}
