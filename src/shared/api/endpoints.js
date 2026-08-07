/**
 * Every Clubhouse endpoint this app uses, as one flat object of functions.
 *
 * Each takes the client as its first argument so the whole surface is
 * trivially testable against a fake transport.
 */

export const endpoints = {
	// --- auth ---------------------------------------------------------
	startPhoneAuth: (c, phoneNumber) =>
		c.request("/start_phone_number_auth", { body: { phone_number: phoneNumber } }),

	callPhoneAuth: (c, phoneNumber) =>
		c.request("/call_phone_number_auth", { body: { phone_number: phoneNumber } }),

	completePhoneAuth: (c, phoneNumber, verificationCode) =>
		c.request("/complete_phone_number_auth", {
			body: { phone_number: phoneNumber, verification_code: verificationCode }
		}),

	refreshToken: (c, refresh) => c.request("/refresh_token", { body: { refresh } }),

	checkWaitlistStatus: c => c.request("/check_waitlist_status", { body: {} }),

	// --- me / profiles ------------------------------------------------
	me: c =>
		c.request("/me", {
			body: { return_blocked_ids: true, return_following_ids: true }
		}),

	getProfile: (c, userId) => c.request("/get_profile", { body: { user_id: userId } }),

	/**
	 * The activity feed - who followed, invited, waved. Not /get_notifications
	 * (that 404s); the live verb is get_activities. Answers { success,
	 * activities, next_cursor }, each activity a list of `details` (each with a
	 * title and an avatar) and an `is_unread` flag. Cursor-paginated.
	 */
	getActivities: (c, { cursor } = {}) => c.request("/get_activities", { body: { cursor } }),

	// --- waves --------------------------------------------------------
	// The "ping a friend to start a room" gesture. get_received_waves /
	// get_initiated_waves answer { success, waves }. send_wave's recipient
	// field was not named on an empty body; user_id is the field every other
	// user-targeted verb here uses (follow, invite_speaker), so it is the bet.
	sendWave: (c, userId) => c.request("/send_wave", { body: { user_id: userId } }),
	getReceivedWaves: c => c.request("/get_received_waves", { body: {} }),
	getInitiatedWaves: c => c.request("/get_initiated_waves", { body: {} }),
	acceptWave: (c, { waveId, userId } = {}) =>
		c.request("/accept_wave", { body: { wave_id: waveId, user_id: userId } }),
	cancelWave: (c, userId) => c.request("/cancel_wave", { body: { user_id: userId } }),

	// --- conversations ------------------------------------------------
	/**
	 * The modern "Chats" feed: async voice/text threads, not 1:1 DMs. Answers
	 * { success, conversations, next_cursor }, each conversation carrying a
	 * title, an AI summary, a creator, a preview and a has_new_segments flag.
	 * Ungated, unlike creating one, which answers "please upgrade your app".
	 */
	getConversations: (c, { cursor } = {}) => c.request("/get_conversations", { body: { cursor } }),

	/** One thread's detail. Named `conversation_id` itself, on a 400. */
	getConversation: (c, conversationId) =>
		c.request("/get_conversation", { body: { conversation_id: conversationId } }),

	updateName: (c, name) => c.request("/update_name", { body: { name } }),

	updateUsername: (c, username) => c.request("/update_username", { body: { username } }),

	updateBio: (c, bio) => c.request("/update_bio", { body: { bio } }),

	// --- social -------------------------------------------------------
	follow: (c, userId) => c.request("/follow", { body: { user_id: userId, source: 4 } }),

	unfollow: (c, userId) => c.request("/unfollow", { body: { user_id: userId } }),

	/** Both named `user_id` themselves, on a 400. */
	block: (c, userId) => c.request("/block", { body: { user_id: userId } }),

	unblock: (c, userId) => c.request("/unblock", { body: { user_id: userId } }),

	getBlockedUsers: c => c.request("/get_blocked_users", { body: {} }),

	/** The people you and they both follow. Also named `user_id` on a 400. */
	getMutualFollows: (c, userId) => c.request("/get_mutual_follows", { body: { user_id: userId } }),

	searchUsers: (c, query) =>
		c.request("/search_users", {
			body: { query, cofollows_only: false, followers_only: false, following_only: false }
		}),

	/**
	 * People to follow. A GET, paginated: answers { users, count, next,
	 * previous, next_sequence }, and `page` walks it. The retired
	 * /get_following and /get_followers had no replacement, so this - and
	 * search - is the whole way to find people now.
	 */
	getSuggestedFollows: (c, { page = 1, pageSize = 25 } = {}) =>
		c.request("/get_suggested_follows_all", {
			query: { in_onboarding: false, page, page_size: pageSize }
		}),

	// get_online_friends, get_notifications, get_events, get_following and
	// get_followers used to live here. All retired by Clubhouse - a plain-text
	// 404, meaning the path is not routed at all - with no replacement found
	// under any name tried. The screens built on them are gone too. See the
	// endpoint table in the README, and `npm run probe` to re-check.

	// --- clubs --------------------------------------------------------
	getClub: (c, clubId) => c.request("/get_club", { body: { club_id: clubId } }),

	followClub: (c, clubId) => c.request("/follow_club", { body: { club_id: clubId } }),

	unfollowClub: (c, clubId) => c.request("/unfollow_club", { body: { club_id: clubId } }),

	// --- rooms --------------------------------------------------------
	/**
	 * The feed replaced the hallway. `/get_channels` now 404s; this answers
	 * { items, available_topics }, where each item wraps one live room in a
	 * `channel` object carrying the same fields `/get_channels` used to return.
	 */
	getFeed: (c, body = {}) => c.request("/get_feed_v3", { body }),

	/**
	 * Chat history. A POST answers 405, so it is a GET, and asked without one
	 * it says "Channel is required." - the same way /send_channel_message named
	 * its fields, and unlike /get_chat_messages, which rejects every shape tried
	 * with an empty error_message and names nothing.
	 *
	 * Newest first, and paginated: the response carries next_cursor (the
	 * oldest message's time as epoch microseconds) and num_messages. Passed
	 * back as `cursor` the server ignored it and re-sent page one, so it goes
	 * under both plausible names - unknown GET parameters are demonstrably
	 * ignored, and the caller's no-progress guard makes a wrong guess safe.
	 */
	getChannelMessages: (c, { channel, cursor } = {}) =>
		c.request("/get_channel_messages", { query: { channel, cursor, next_cursor: cursor } }),

	/** `{ channel, message }` - the API named `message` itself, on a 400. */
	sendChatMessage: (c, { channel, message } = {}) =>
		c.request("/send_channel_message", { body: { channel, message } }),

	/**
	 * An emoji over somebody's tile. The endpoint named all three fields, one
	 * 400 at a time: `channel`, then "Reaction id is required." (the ids live
	 * in join_channel's `reactions.channel_reactions` objects - shape
	 * { id, sort_priority, emoji }), then "Target user id is required." - a
	 * reaction lands on a person, and reacting to the room at large means
	 * targeting yourself, which is where the phone app draws your own.
	 */
	sendChannelReaction: (c, channel, reactionId, targetUserId) =>
		c.request("/send_channel_reaction", {
			body: { channel, reaction_id: reactionId, target_user_id: targetUserId }
		}),

	/**
	 * Liking one chat message. Both named `channel` on a 400; history rows
	 * carry viewer_has_liked, and other people's likes arrive as
	 * channel_message_like_count_update.
	 */
	likeChatMessage: (c, channel, messageId) =>
		c.request("/like_channel_message", { body: { channel, message_id: messageId } }),

	unlikeChatMessage: (c, channel, messageId) =>
		c.request("/unlike_channel_message", { body: { channel, message_id: messageId } }),

	joinChannel: (c, channel) =>
		c.request("/join_channel", {
			body: { channel, attribution_source: "feed", attribution_details: "e30=" }
		}),

	leaveChannel: (c, channel) =>
		c.request("/leave_channel", { body: { channel, channel_id: null } }),

	activePing: (c, channel) => c.request("/active_ping", { body: { channel, channel_id: null } }),

	/**
	 * The old is_private/is_social_mode flags are no longer enough. The server
	 * named its field one 400 at a time: "Privacy level is required." while it
	 * was sent as `privacy`, then '"open" is not a valid choice.' once
	 * privacy_level carried it - so the field is right and the value spelling
	 * was wrong. Verified live: an open room is created with privacy_level
	 * "PUBLIC" (the response echoes privacy_settings.type "public"). The other
	 * two kinds are spelled to match; the legacy flags ride along, ignored if
	 * unread.
	 */
	createChannel: (c, { topic = "", userIds = [], isPrivate = false, isSocialMode = false } = {}) => {
		const privacyLevel = isPrivate ? "PRIVATE" : isSocialMode ? "SOCIAL" : "PUBLIC";
		return c.request("/create_channel", {
			body: {
				topic,
				user_ids: userIds,
				privacy_level: privacyLevel,
				is_private: isPrivate,
				is_social_mode: isSocialMode
			}
		});
	},

	endChannel: (c, channel) => c.request("/end_channel", { body: { channel } }),

	// --- room settings ------------------------------------------------
	// Verb names read from the Android app (docs/api-endpoints.md), request
	// bodies confirmed live: each 200'd and the read-back field moved.

	/** Room chat on/off. A hosted room starts with is_chat_enabled false. */
	enableRoomChat: (c, channel) => c.request("/enable_channel_messages", { body: { channel } }),
	disableRoomChat: (c, channel) => c.request("/disable_channel_messages", { body: { channel } }),

	/** Who may chat: 1 everyone, 2 the host's followers, 3 trusted followers. */
	setChatPermission: (c, channel, permission) =>
		c.request("/set_chat_permission", { body: { channel, chat_permission: permission } }),

	/**
	 * Hand-raise mode. change_handraise_settings 404s; the live verb is this
	 * one, taking handraise_queue_setting (0 off, non-zero on).
	 */
	setHandraiseQueue: (c, channel, setting) =>
		c.request("/update_handraise_queue_setting", { body: { channel, handraise_queue_setting: setting } }),

	/** Rename the room. The field is `title`, not topic/channel_title. */
	setChannelTitle: (c, channel, title) =>
		c.request("/set_channel_title", { body: { channel, title } }),

	// --- room polls ---------------------------------------------------
	// join_channel carries channel_user_poll; these three were confirmed live.
	// A poll is poll_metadata { poll_id, poll_title, poll_options[{ poll_option_id,
	// poll_option_title }] } and poll_results { total_votes_text,
	// poll_option_results[{ poll_option_id, percentage }] }.

	/** The room's current poll, or an empty one. `{ channel }`. */
	getChannelPoll: (c, channel) => c.request("/get_channel_user_poll", { body: { channel } }),

	/**
	 * Start a poll. `options` is an array of plain strings; the server took
	 * `{ channel, title, options }` and 200'd. Titles run 5-80 chars and
	 * options 5-30, per the room's poll_validation_rules.
	 */
	createChannelPoll: (c, { channel, title, options } = {}) =>
		c.request("/create_channel_user_poll", { body: { channel, title, options } }),

	/**
	 * Vote. Not /vote_channel_user_poll (that 404s) - the verb is
	 * submit_channel_user_poll_vote, and it takes the poll and the option by
	 * their ids. Confirmed by the tally moving from "0 votes" to "1 votes".
	 */
	voteChannelPoll: (c, { channel, pollId, pollOptionId } = {}) =>
		c.request("/submit_channel_user_poll_vote", {
			body: { channel, poll_id: pollId, poll_option_id: pollOptionId }
		}),

	// --- room moderation ----------------------------------------------
	inviteSpeaker: (c, channel, userId) =>
		c.request("/invite_speaker", { body: { channel, user_id: userId } }),

	uninviteSpeaker: (c, channel, userId) =>
		c.request("/uninvite_speaker", { body: { channel, user_id: userId } }),

	/**
	 * Step onto the stage after a moderator invites you. Not
	 * /accept_speaker_invite - that is retired (404). This one named `channel`
	 * itself on a 400, and it is about you, so it takes no user id.
	 */
	becomeSpeaker: (c, channel) => c.request("/become_speaker", { body: { channel } }),

	makeModerator: (c, channel, userId) =>
		c.request("/make_moderator", { body: { channel, user_id: userId } }),

	muteSpeaker: (c, channel, userId) =>
		c.request("/mute_speaker", { body: { channel, user_id: userId } }),

	blockFromChannel: (c, channel, userId) =>
		c.request("/block_from_channel", { body: { channel, user_id: userId } }),

	raiseHand: (c, channel, raise = true) =>
		c.request("/audience_reply", {
			body: { channel, raise_hands: raise, unraise_hands: !raise }
		}),

	// --- invites ------------------------------------------------------
	inviteToApp: (c, name, phoneNumber) =>
		c.request("/invite_to_app", { body: { name, phone_number: phoneNumber } }),

	inviteToExistingChannel: (c, channel, userId) =>
		c.request("/invite_to_existing_channel", { body: { channel, user_id: userId } })
};

/** Binds every endpoint to a client, so callers write `api.getChannels()`. */
export function createApi(client) {
	const api = {};
	for (const [name, fn] of Object.entries(endpoints)) {
		api[name] = (...args) => fn(client, ...args);
	}

	return api;
}
