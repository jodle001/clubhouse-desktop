# Clubhouse API endpoints

Ground truth, read out of the official Android app (`com.clubhouse.app`
**26.08.04**, build 1037932) with `npm run endpoints`. Retrofit compiles every
route into the dex as a string literal, so this is the app's real surface, not
a guess. The extractor also catches field names and resource ids; the list
below is the curated set of genuine endpoints, grouped by feature, with what
this desktop client already implements marked **[done]**.

Request bodies are not in the dex as such - only the route names are certain.
Where a body is shown it was confirmed live (via a probe) or inferred from the
field names that travel with it; anything unconfirmed is marked `?`.

## Auth & account
- `start_phone_number_auth` **[done]**, `call_phone_number_auth`,
  `resend_phone_number_auth`, `complete_phone_number_auth` **[done]**
- `complete_flash_call_auth`, `complete_password_auth`, `create_password`
- `refresh_token` **[done]**, `start_change_phone_number`, `start_lost_access`,
  `start_lost_password_access`
- `add_email`, `update_email`, `add_age`, `start_age_verification`,
  `check_age_verification_status`, `check_contact_verification`
- `get_settings`, `get_account_settings`, `update_notifications`,
  `update_displayname` (**[done]** as `update_name`), `update_username` **[done]**,
  `suggest_username`, `set_anonymous_status`,
  `get_language_preferences`, `update_language_preferences`

## Rooms / channels
- `create_channel` **[done]** (`privacy_level: PUBLIC|SOCIAL|PRIVATE`),
  `join_channel` **[done]**, `leave_channel` **[done]**, `end_channel` **[done]**,
  `active_ping` **[done]**
- `get_channel`, `get_channel_audience`, `preview_channel`,
  `preview_join_channel`, `expire_channel`, `hide_channel`
- **Settings (the moderator panel):**
  - `enable_channel_messages` / `disable_channel_messages` — room chat on/off
  - `set_chat_permission` — `chat_permission: 1|2|3` (everyone / host's
    followers / trusted followers)
  - `change_handraise_settings` — hand-raise on/off and who
  - `update_handraise_queue_setting` — `handraise_queue_setting`
  - `set_channel_title` — rename
  - `set_channel_banner` / `remove_channel_banner` / `get_channel_banner`
  - `update_channel_image`, `add_channel_link` / `remove_channel_link` /
    `update_channel_links` / `check_channel_link`
  - `set_web_listening_enabled`, `schedule_room`
- **Stage:** `add_speaker`, `remove_speaker`, `invite_speaker` **[done]**,
  `uninvite_speaker` **[done]**, `accept_speaker_invite`, `reject_speaker_invite`,
  `become_speaker` **[done]**, `make_moderator` **[done]**, `mute_speaker` **[done]**,
  `get_handraise_queue`, `audience_reply` **[done]** (raise hand),
  `update_microphone_enabled`, `update_speaker_call_status`,
  `hide_from_audience`, `update_channel_user_status`
- `invite_to_channel`, `invite_to_app_and_channel`,
  `record_external_channel_share`, `submit_channel_rating`,
  `get_reportable_channels`, `report_departed_speakers`, `get_room_recap`

## Room chat
- `send_chat_message` **[done]**, `get_chat_messages` (**[done]** as
  `get_channel_messages`), `delete_channel_message`,
  `get_channel_message_likes`, like/unlike **[done]**
  (`like_channel_message` / `unlike_channel_message`)

## Polls **[done]**
- `create_channel_user_poll` **[done]**, `get_channel_user_poll` **[done]**,
  `submit_channel_user_poll_vote` **[done]**, `remove_channel_user_poll`,
  `update_poll_visibility`, `override_existing_poll`, `create_poll`

## Reactions
- `send_channel_reaction` **[done, gated]** — the only channel-reaction send
  verb; refuses with "Feature flag is not enabled" and no header/field moves
  it, confirmed by the APK carrying no alternative. Receiving works.
- `get_available_reactions`, `get_paid_reactions_in_channel`,
  `send_paid_reaction_thanks`, `send_highlight_reaction` — the modern reaction
  surface is paid-reaction shaped

## Direct messages / conversations
- `get_chats`, `get_chat`, `create_conversation`, `get_conversations` **[done]**,
  `get_conversation` **[done]**
- `add_conversation_segment` (post to a thread), `get_conversation_segments`,
  `delete_conversation_segment`
- `add_conversation_members`, `remove_conversation_member`,
  `get_conversation_members`, `update_conversation_title`, `invite_to_conversation`
- `add_conversation_reaction` / `remove_conversation_reaction` /
  `get_conversation_reactions`
- `mark_conversation_as_read` / `mark_conversation_as_unread`,
  `update_last_read_message`, `delete_conversation`, `hide_conversation`,
  `expire_conversation`, `subscribe_to_conversation` /
  `unsubscribe_from_conversation`, `get_conversation_summary`
- `get_dm_conversation_requests`, `accept_dm_conversation_request`,
  `block_dm_conversation_request`, `hide_dm_conversation_request`
- `get_archived_conversations`, `unarchive_chat`, `search_dm_conversations`

## Waves
- `send_wave` **[built, presence-gated]** — `{ to_user_profile_id, source }`;
  `source` is a `SourceLocation` enum sent as an uppercase string (PROFILE,
  WAVE, WAVE_AT_FRIENDS, BUDDY_LIST, WHOS_ONLINE, …). This is the app's exact
  body (jadx), yet the server refuses it with an empty 400 under every client
  identity (2021, current Android, current iOS) and every source value. The
  wave vocabulary is all presence — `online_user_id`, `WHOS_ONLINE`,
  `initiate_wave` — so waving requires Clubhouse's live "who's online"
  heartbeat, which this client does not maintain. Not a payload or version
  problem; a server-side presence condition no headless client satisfies.
- `accept_wave` **[done]** — `{ from_user_profile_id, wave_id, source }`;
  returns a room (waving back starts a room together)
- `cancel_wave` — `{ to_user_profile_id }`; `cancel_waves` takes nothing
- `get_received_waves` **[done]**, `get_initiated_waves` **[done]** —
  `{ success, waves }`
- `initiate_wave` (404 on this build), `suspend_wave` / `suspend_sent_wave` /
  `unsuspend_sent_wave`

## Follows & people
- `follow` **[done]**, `unfollow` **[done]**, `block` **[done]**, `unblock` **[done]**,
  `follow_user`, `follow_multiple`, `remove_follower`, `ignore_suggested_follow`
- `get_followers`, `get_following`, `get_cofollows`, `get_mutual_cofollows`,
  `get_mutual_follows` **[done]**, `get_followers_to_follow`,
  `get_profiles_who_viewed_you`, `get_user_badges`, `get_user_social_graph`,
  `get_user_profiles`, `get_user_photo_history`, `get_user_social_clubs`
- `enable_follower_requests` / `disable_follower_requests`,
  `update_follow_notifications`

## Discovery & feeds
- `get_feed` **[done]** (`get_feed_v3`), `refresh_feed`
- `get_discovery_feed` — a public discovery surface (the "why only my friends'
  rooms" answer)
- `get_highlights_feed`, `get_my_clips_feed`, `get_profile_feed`,
  `get_profile_highlights_feed`, `get_profile_poll_feed`,
  `get_profile_replay_feed`
- `get_suggested_speakers`, `get_suggested_invites`,
  `get_suggested_follows_all` **[done]**, `get_suggested_follows_similar`
- `search_users` **[done]**, `search_channel_users`

## Notifications
- `get_activities`, `get_notifications`, `get_user_announcement`,
  `update_notifications`

## Social clubs (houses)
- `create_social_club`, `get_social_club`, `get_social_club_members`,
  `join_social_club` / `leave_social_club`, `invite_social_club`,
  `delete_social_club`, `add_social_club_member` / `remove_social_club_member`,
  `check_my_social_club_membership`, `pin_social_club`, `get_user_social_clubs`,
  `get_social_club_recommendations`
- `update_social_club_name` / `_description` / `_photo` / `_settings`
- Events: `get_social_club_events`, `create_social_club_event`,
  `edit_social_club_event`, `delete_social_club_event`, `rsvp_social_club_event`
- Waitlist: `join_social_club_waitlist` / `leave_social_club_waitlist` /
  `get_social_club_waitlist`

## Clips & replays
- `create_clip`, `get_replays`, `get_saved_replays`, `save_replay` /
  `unsave_replay`, `delete_replay`, `get_replay_chunk`, `hide_replay`,
  `update_replay_visibility`, `join_replay_channel` / `leave_replay_channel`
- `get_highlight`, `delete_highlight`, `view_speaker_highlight`

## Profile
- `get_profile` **[done]**, `self_profile`, `me` **[done]**
- `update_photo` / `remove_photo` / `set_profile_photo`,
  `update_twitter_username`, `update_instagram_username`,
  `update_nsfw_status`, `update_user_highlights_setting`

## Misc
- `check_for_update` **[done]** (doctor), `get_url_preview`, `get_invite_link` /
  `get_unified_invite_link`, `get_virtual_currencies`, `get_karma_details`,
  `create_incident`, `submit_ticket`, `get_incident_categories`
