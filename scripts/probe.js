#!/usr/bin/env node
/**
 * Asks the live API which endpoints still exist.
 *
 * This app was written against Clubhouse's 2021 API. Some of those paths are
 * gone: they answer a plain-text "Not found", which is a router miss rather
 * than an error the app can interpret. Published documentation is all from the
 * same era, so the only reliable way to find what replaced them is to ask.
 *
 *   npm run probe                          # the built-in candidate list
 *   npm run probe -- get_feed_v3 ...       # try specific names as well
 *   npm run probe -- --shape get_feed_v3   # print its response structure
 *
 * --shape prints types and nesting rather than the response itself, so the
 * output can be shared without handing over names, tokens or phone numbers.
 *
 * Uses the signed-in session and the app's own identity and headers, so a
 * result here means the same thing inside the app.
 */

import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { API_ROOT, APP_IDENTITY, buildHeaders } from "../src/shared/profile.js";
import { nodeTransport } from "../src/main/transport.js";

const PRODUCT = "Clubhouse Desktop";

/** Where electron-store puts the session, per platform. */
function sessionPath() {
	if (process.platform === "darwin") {
		return join(homedir(), "Library", "Application Support", PRODUCT, "session.json");
	}

	if (process.platform === "win32") {
		return join(process.env.APPDATA || join(homedir(), "AppData", "Roaming"), PRODUCT, "session.json");
	}

	return join(process.env.XDG_CONFIG_HOME || join(homedir(), ".config"), PRODUCT, "session.json");
}

function loadSession() {
	const path = sessionPath();

	try {
		const store = JSON.parse(readFileSync(path, "utf8"));
		return {
			deviceId: store.deviceId,
			userId: store.user?.user_profile?.user_id,
			authToken: store.user?.auth_token
		};
	} catch {
		console.error(`\nNo signed-in session at ${path}\nSign in with \`npm start\` first.\n`);
		process.exit(1);
	}
}

// method: POST sends a body, GET sends a query string.
const CANDIDATES = [
	// Known good, so a total failure is obvious rather than confusing.
	{ path: "/me", method: "POST", body: {} },

	// What the app calls now, and which 404s.
	{ path: "/get_channels", method: "POST", body: {} },
	{ path: "/get_online_friends", method: "POST", body: {} },
	{ path: "/get_events", method: "GET", query: { page: 1, page_size: 25 } },

	// The feed replaced the hallway in the 2022 redesign.
	{ path: "/get_feed_v3", method: "POST", body: {} },
	{ path: "/get_feed_v2", method: "POST", body: {} },
	{ path: "/get_feed", method: "POST", body: {} },
	{ path: "/get_feed_v3", method: "GET", query: {} },

	// --- discovery, as opposed to the feed --------------------------------
	// get_feed_v3 is personalised: rooms from people you follow and houses you
	// are in. /me answers should_show_explore_public_hallway: true and carries
	// ENABLE_DISCOVERY_TAB_ANDROID, so a public surface exists under some name.
	{ path: "/get_explore", method: "POST", body: {} },
	{ path: "/get_explore_v2", method: "POST", body: {} },
	{ path: "/explore", method: "POST", body: {} },
	{ path: "/get_discovery", method: "POST", body: {} },
	{ path: "/get_discover", method: "POST", body: {} },
	{ path: "/get_public_hallway", method: "POST", body: {} },
	{ path: "/get_hallway", method: "POST", body: {} },
	{ path: "/get_public_channels", method: "POST", body: {} },
	{ path: "/get_suggested_channels", method: "POST", body: {} },
	{ path: "/get_trending_channels", method: "POST", body: {} },
	{ path: "/get_top_channels", method: "POST", body: {} },
	// /search_users is alive, so the room equivalent is worth trying too.
	{ path: "/search_channels", method: "POST", body: { query: "a" } },
	{ path: "/search_clubs", method: "POST", body: { query: "a" } },
	{ path: "/search_all", method: "POST", body: { query: "a" } },

	// Other shapes worth ruling in or out.
	{ path: "/get_online_channels", method: "POST", body: {} },
	{ path: "/get_all_channels", method: "POST", body: {} },
	{ path: "/get_upcoming_events", method: "GET", query: { page: 1, page_size: 25 } },
	{ path: "/get_events_v2", method: "GET", query: { page: 1, page_size: 25 } },

	// Endpoints the app also depends on, worth checking in the same pass.
	{ path: "/get_notifications", method: "GET", query: { page: 1, page_size: 20 } },
	{ path: "/get_actionable_notifications", method: "GET", query: {} },
	{ path: "/get_suggested_follows_friends_only", method: "POST", body: { page: 1, page_size: 25 } },
	{ path: "/get_following", method: "GET", query: { user_id: 0, page: 1, page_size: 25 } },

	// --- profiles and following ---------------------------------------
	{ path: "/get_profile", method: "POST", body: {} },
	{ path: "/search_users", method: "POST", body: { query: "a" } },
	{ path: "/get_user_following", method: "POST", body: {} },
	{ path: "/get_user_followers", method: "POST", body: {} },
	{ path: "/get_following_v2", method: "POST", body: {} },
	{ path: "/get_followers_v2", method: "POST", body: {} },
	{ path: "/get_suggested_follows_all", method: "GET", query: { in_onboarding: false, page: 1, page_size: 10 } },

	// --- room chat ------------------------------------------------------
	// join_channel reports is_room_chat_available and can_post_to_chat, so the
	// feature exists; only its endpoint names are unknown.
	{ path: "/get_chat_messages", method: "POST", body: {} },
	{ path: "/get_channel_messages", method: "POST", body: {} },
	{ path: "/get_room_chat_messages", method: "POST", body: {} },
	{ path: "/send_chat_message", method: "POST", body: {} },
	{ path: "/send_channel_message", method: "POST", body: {} },

	// --- activity -------------------------------------------------------
	{ path: "/get_activity", method: "POST", body: {} },
	{ path: "/get_notifications_v2", method: "POST", body: {} },
	{ path: "/get_channel", method: "POST", body: {} },

	// --- reactions --------------------------------------------------------
	// join_channel returns emoji_reaction_options and per-context reaction
	// lists, PubNub delivers new_channel_reaction, and user_capabilities has
	// can_gif_react - the feature is fully described except for the verb that
	// sends one. Empty bodies, so nothing here can react on anybody's behalf.
	{ path: "/send_channel_reaction", method: "POST", body: {} },
	{ path: "/send_reaction", method: "POST", body: {} },
	{ path: "/channel_reaction", method: "POST", body: {} },
	{ path: "/send_emoji_reaction", method: "POST", body: {} },
	{ path: "/react", method: "POST", body: {} },
	{ path: "/send_audio_reaction", method: "POST", body: {} },
	{ path: "/send_profile_reaction", method: "POST", body: {} },

	// --- chat message likes ----------------------------------------------
	// channel_message_like_count_update arrives over PubNub when somebody else
	// likes a line, and history rows carry viewer_has_liked - so the sender
	// exists under some name.
	{ path: "/like_channel_message", method: "POST", body: {} },
	{ path: "/unlike_channel_message", method: "POST", body: {} },
	{ path: "/like_message", method: "POST", body: {} },
	{ path: "/send_channel_message_like", method: "POST", body: {} },

	// --- direct messages --------------------------------------------------
	// /me reports unread_conversations_count and get_profile answers can_dm,
	// can_chat and chatting_with, so conversations exist server-side.
	{ path: "/get_conversations", method: "POST", body: {} },
	{ path: "/get_conversations", method: "GET", query: {} },
	{ path: "/get_chats", method: "POST", body: {} },
	{ path: "/get_conversation", method: "POST", body: {} },
	{ path: "/get_conversation_messages", method: "GET", query: {} },
	{ path: "/send_conversation_message", method: "POST", body: {} },
	{ path: "/create_conversation", method: "POST", body: {} },
	{ path: "/get_message_requests", method: "POST", body: {} },

	// --- waves ------------------------------------------------------------
	// get_profile answers can_wave, so the verb exists.
	{ path: "/wave", method: "POST", body: {} },
	{ path: "/send_wave", method: "POST", body: {} },
	{ path: "/wave_to_user", method: "POST", body: {} },

	// --- room polls -------------------------------------------------------
	// join_channel carries channel_user_poll with validation rules and an
	// upsell card, so polls are live in rooms.
	{ path: "/create_channel_user_poll", method: "POST", body: {} },
	{ path: "/vote_channel_user_poll", method: "POST", body: {} },
	{ path: "/get_channel_user_poll", method: "POST", body: {} },

	// --- taking the stage ------------------------------------------------
	// /accept_speaker_invite is retired (404), so being invited up currently
	// cannot be accepted. join_channel marks the invitation on your own user
	// record as is_invited_as_speaker, so the state exists - only the verb is
	// missing. Empty bodies, so none of these can promote anybody by asking.
	{ path: "/accept_speaker_invite", method: "POST", body: {} },
	{ path: "/join_as_speaker", method: "POST", body: {} },
	{ path: "/become_speaker", method: "POST", body: {} },
	{ path: "/add_speaker", method: "POST", body: {} },
	{ path: "/accept_channel_invite", method: "POST", body: {} },
	{ path: "/accept_speaker_invitation", method: "POST", body: {} },
	{ path: "/change_speaker_status", method: "POST", body: {} },
	{ path: "/update_speaker_status", method: "POST", body: {} },
	{ path: "/speaker_invite_response", method: "POST", body: {} },
	{ path: "/audience_reply", method: "POST", body: {} },

	// --- leaving the stage ------------------------------------------------
	// The inverse of /become_speaker. A moderator has /uninvite_speaker for
	// somebody else; what a speaker uses on themselves is unknown. Empty
	// bodies, so none of these can take anybody off stage by asking.
	{ path: "/leave_speaker", method: "POST", body: {} },
	{ path: "/become_audience", method: "POST", body: {} },
	{ path: "/become_listener", method: "POST", body: {} },
	{ path: "/move_to_audience", method: "POST", body: {} },
	{ path: "/leave_stage", method: "POST", body: {} },
	{ path: "/step_down", method: "POST", body: {} },
	{ path: "/remove_speaker", method: "POST", body: {} },
	{ path: "/uninvite_speaker", method: "POST", body: {} },

	// --- blocking and reporting -----------------------------------------
	// /me already reports blocked_ids, so the state is known; what is missing
	// is how to change it. Sent empty, so nobody is blocked by asking.
	{ path: "/block", method: "POST", body: {} },
	{ path: "/unblock", method: "POST", body: {} },
	{ path: "/block_user", method: "POST", body: {} },
	{ path: "/unblock_user", method: "POST", body: {} },
	{ path: "/get_blocked_users", method: "POST", body: {} },
	{ path: "/report_incident", method: "POST", body: {} },

	// --- follow requests, for private accounts --------------------------
	// /me returns requested_following_ids, so these exist in some form.
	{ path: "/get_follow_requests", method: "POST", body: {} },
	{ path: "/accept_follow_request", method: "POST", body: {} },
	{ path: "/get_mutual_follows", method: "POST", body: {} },
	{ path: "/get_events_for_user", method: "POST", body: {} }
];

// Everything above is sent with an empty or read-only body on purpose: an
// endpoint that needs arguments answers 400, which proves it exists without
// following anyone or posting anything.

function describe(status, contentType, text) {
	const flat = text.replace(/\s+/g, " ").trim();

	if (status === 404) {
		return "gone";
	}

	if (!/json/i.test(contentType || "")) {
		return `not JSON: ${flat.slice(0, 60)}`;
	}

	try {
		const data = JSON.parse(flat);

		// A 4xx from a real endpoint means it exists and wants different
		// arguments - useful, and quite different from a missing path.
		if (status >= 400) {
			const why = data.error_message || data.detail || "";
			return `ALIVE, rejected the call${why ? `: ${String(why).slice(0, 60)}` : ""}`;
		}

		const keys = Object.keys(data).slice(0, 6).join(", ");
		return `ALIVE { ${keys}${Object.keys(data).length > 6 ? ", ..." : ""} }`;
	} catch {
		return `unparseable: ${flat.slice(0, 60)}`;
	}
}

/** Values that identify a person, or authorise as one. */
const SENSITIVE = /token|phone|email|secret|password|auth/i;

/**
 * Renders types and nesting instead of data, so the result can be pasted
 * somewhere public. Arrays are described by their first element.
 */
function shapeOf(value, indent = "  ", depth = 0) {
	if (value === null) {
		return "null";
	}

	if (Array.isArray(value)) {
		if (value.length === 0) {
			return "array[0]";
		}

		// A feed mixes item kinds, so describing only the first element would
		// hide the rest. Show one example of each distinct shape.
		const variants = new Map();
		for (const element of value) {
			const key =
				element && typeof element === "object" && !Array.isArray(element)
					? typeof element.type === "string"
						? `type=${element.type}`
						: Object.keys(element).sort().join(",")
					: typeof element;

			if (!variants.has(key)) {
				variants.set(key, element);
			}
		}

		if (variants.size === 1) {
			return `array[${value.length}] of ${shapeOf(value[0], indent + "  ", depth + 1)}`;
		}

		const described = [...variants.entries()].map(
			([key, element]) => `${indent}  ${key}: ${shapeOf(element, indent + "    ", depth + 1)}`
		);

		return `array[${value.length}], ${variants.size} shapes:\n${described.join("\n")}`;
	}

	if (typeof value === "object") {
		if (depth >= 6) {
			return "{ ... }";
		}

		const lines = Object.entries(value).map(([key, child]) => {
			const rendered = SENSITIVE.test(key) ? `${typeof child} <hidden>` : shapeOf(child, indent + "  ", depth + 1);
			return `${indent}${key}: ${rendered}`;
		});

		return `{\n${lines.join("\n")}\n${indent.slice(2)}}`;
	}

	if (typeof value === "string") {
		const flat = value.replace(/\s+/g, " ");
		return `string ${JSON.stringify(flat.length > 40 ? `${flat.slice(0, 40)}...` : flat)}`;
	}

	return `${typeof value} ${value}`;
}

const session = loadSession();
const args = process.argv.slice(2);

/**
 * --shape                      print structure instead of a verdict
 * --channel PAKBKoJ7           room endpoints need one, and an endpoint asked
 *                              for a channel and nothing else will name its
 *                              next required field in the error
 * --param key=value            any other parameter, repeatable
 * name [name...]               endpoints to try on top of the built-in list
 */
const params = {};
const names = [];
let wantsShape = false;
let channel = null;

for (let i = 0; i < args.length; i++) {
	const arg = args[i];

	if (arg === "--shape") {
		wantsShape = true;
	} else if (arg === "--channel") {
		channel = args[++i];
	} else if (arg === "--param") {
		const [key, ...rest] = String(args[++i] ?? "").split("=");
		if (key) {
			params[key] = rest.join("=");
		}
	} else if (!arg.startsWith("--")) {
		names.push(arg);
	}
}

const given = { ...params, ...(channel ? { channel } : {}) };

const extra = names.map(name => ({
	path: name.startsWith("/") ? name : `/${name}`,
	method: "POST",
	body: given
}));

/**
 * Chat history. Two candidates, and they behave differently: /get_chat_messages
 * rejects everything with 400 and an empty error_message, naming nothing, while
 * /get_channel_messages answers "Channel is required." - the same way
 * /send_channel_message named its fields. The pair also reads right:
 * send_channel_message and get_channel_messages. Try the plausible shapes of
 * both in one run rather than one command per guess.
 */
const historyAttempts = [];
if (channel) {
	const id = params.channel_id;
	const shapes = [
		{ channel },
		{ channel, count: 50 },
		{ channel, page_size: 50 },
		{ channel, limit: 50 },
		...(id
			? [
				{ channel_id: id },
				{ channel_id: id, count: 50 },
				{ channel, channel_id: id, count: 50 }
			]
			: [])
	];

	for (const path of ["/get_channel_messages", "/get_chat_messages"]) {
		for (const query of shapes) {
			historyAttempts.push({ path, method: "GET", query });
		}
	}
}

console.log(`\nIdentity: ${APP_IDENTITY.userAgent} ${APP_IDENTITY.appVersion} (${APP_IDENTITY.appBuild})`);
console.log(`Signed in as user ${session.userId ?? "(unknown)"}\n`);

const alive = [];
// --shape only makes sense for endpoints actually asked for.
const targets = wantsShape ? extra : [...CANDIDATES, ...historyAttempts, ...extra];

if (wantsShape && extra.length === 0) {
	console.error("--shape needs an endpoint, e.g. npm run probe -- --shape get_feed_v3\n");
	process.exit(1);
}

/** One request, exactly as the app would send it. */
async function attempt(candidate) {
	let url = API_ROOT + candidate.path;

	if (candidate.query) {
		const qs = new URLSearchParams(candidate.query).toString();
		if (qs) {
			url += `?${qs}`;
		}
	}

	const headers = buildHeaders({ ...session, host: new URL(API_ROOT).host });
	const options = { method: candidate.method, headers };

	if (candidate.body !== undefined) {
		headers["Content-Type"] = "application/json; charset=utf-8";
		options.body = JSON.stringify(candidate.body);
	}

	const response = await nodeTransport(url, options);
	return { response, text: await response.text() };
}

/** Swaps POST for GET and back, carrying the parameters across. */
function otherMethod(candidate) {
	if (candidate.method === "POST") {
		return { ...candidate, method: "GET", body: undefined, query: candidate.body || {} };
	}

	return { ...candidate, method: "POST", query: undefined, body: candidate.query || {} };
}

for (const candidate of targets) {
	// Several attempts can share a path and differ only in parameters, so name
	// them by what was sent.
	const sent = Object.keys(candidate.query || candidate.body || {});
	const suffix = sent.length ? ` ?${sent.join("&")}` : "";
	const label = `${candidate.method} ${candidate.path}${suffix}`.padEnd(52);

	try {
		let used = candidate;
		let { response, text } = await attempt(candidate);

		// 405 says the path exists but wants the other verb, so ask again
		// rather than making the reader run it a second time by hand.
		if (response.status === 405) {
			used = otherMethod(candidate);
			({ response, text } = await attempt(used));
		}

		if (wantsShape) {
			console.log(`${used.method} ${used.path} -> ${response.status}`);

			try {
				console.log(shapeOf(JSON.parse(text)), "\n");
			} catch {
				console.log(`  (not JSON) ${text.slice(0, 200)}\n`);
			}

			continue;
		}

		const verdict = describe(response.status, response.headers?.["content-type"], text);
		const retried = used !== candidate ? ` (as ${used.method})` : "";

		console.log(`${label} ${String(response.status).padEnd(4)} ${verdict}${retried}`);

		if (response.status !== 404) {
			alive.push(`${used.method} ${used.path}`);
		}
	} catch (error) {
		console.log(`${label} ---  ${error.message}`);
	}
}

if (!wantsShape) {
	const unique = [...new Set(alive)];
	console.log(`\nStill served: ${unique.length ? unique.join(", ") : "nothing"}\n`);
}
