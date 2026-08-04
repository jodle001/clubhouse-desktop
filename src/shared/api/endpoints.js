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
	 * An emoji over the room. The endpoint named both its fields on 400s:
	 * `channel`, then - when sent an emoji under `reaction` - "Reaction id is
	 * required." The ids live in join_channel's `reactions.channel_reactions`
	 * objects, the id-bearing twin of the emoji_reactions string list.
	 */
	sendChannelReaction: (c, channel, reactionId) =>
		c.request("/send_channel_reaction", { body: { channel, reaction_id: reactionId } }),

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

	createChannel: (c, { topic = "", userIds = [], isPrivate = false, isSocialMode = false } = {}) =>
		c.request("/create_channel", {
			body: {
				topic,
				user_ids: userIds,
				is_private: isPrivate,
				is_social_mode: isSocialMode
			}
		}),

	endChannel: (c, channel) => c.request("/end_channel", { body: { channel } }),

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
