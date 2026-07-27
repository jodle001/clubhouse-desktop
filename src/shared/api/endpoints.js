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
	 * Chat history, and unsolved. The path exists - a POST answers 405, so it
	 * is a GET - but it rejects `channel`, `channel_id` and both together with
	 * 400 and an empty error_message, from inside the room and outside it. The
	 * app does not call it: live messages arrive over PubNub as
	 * `new_channel_message`, so the only thing missing is history from before
	 * you walked in. Kept for `npm run probe` to keep poking at.
	 */
	getChatMessages: (c, { channel, channelId } = {}) =>
		c.request("/get_chat_messages", { query: { channel, channel_id: channelId } }),

	/** `{ channel, message }` - the API named `message` itself, on a 400. */
	sendChatMessage: (c, { channel, message } = {}) =>
		c.request("/send_channel_message", { body: { channel, message } }),

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

	acceptSpeakerInvite: (c, channel, userId) =>
		c.request("/accept_speaker_invite", { body: { channel, user_id: userId } }),

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
