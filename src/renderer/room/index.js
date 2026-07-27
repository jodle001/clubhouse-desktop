/**
 * Room events (who joined, who left, who was muted, who raised a hand) arrive
 * over PubNub. Same treatment as audio: a port with a null adapter, so a room
 * still opens and lists its speakers even when live updates are unavailable.
 */

/**
 * Actions seen in the wild. Documentation, not a filter - anything that arrives
 * is emitted, and the adapter logs whatever nothing is listening for, which is
 * how the last two on this list were found.
 */
const ACTIONS = [
	"join_channel",
	"leave_channel",
	"end_channel",
	"add_speaker",
	"remove_speaker",
	"make_moderator",
	"invite_speaker",
	"raise_hands",
	"unraise_hands",
	"new_channel_message",
	"cumulative_count_update"
];

class Emitter {
	constructor() {
		this._handlers = new Map();
	}

	on(event, handler) {
		if (!this._handlers.has(event)) {
			this._handlers.set(event, new Set());
		}

		this._handlers.get(event).add(handler);
		return () => this._handlers.get(event)?.delete(handler);
	}

	emit(event, payload) {
		for (const handler of this._handlers.get(event) || []) {
			handler(payload);
		}
	}

	hasHandlers(event) {
		return (this._handlers.get(event)?.size ?? 0) > 0;
	}
}

export class NullRoomEvents extends Emitter {
	constructor({ log = () => {} } = {}) {
		super();
		this.name = "null";
		this.log = log;
	}

	async subscribe(channel) {
		this.log(`[room:null] not subscribing to ${channel.channel}`);
	}

	async unsubscribe() {}
}

/** Lets tests push events into the room as if PubNub had delivered them. */
export class FakeRoomEvents extends NullRoomEvents {
	constructor(options) {
		super(options);
		this.name = "fake";
		this.subscribed = null;
	}

	async subscribe(channel) {
		this.subscribed = channel;
	}

	async unsubscribe() {
		this.subscribed = null;
	}

	/** Deliver a message as PubNub would - including actions we do not know. */
	deliver(message) {
		if (!message?.action) {
			return;
		}

		this.emit(message.action, message);
	}
}

export class PubNubRoomEvents extends Emitter {
	constructor({ publishKey, subscribeKey, userId, log = () => {} } = {}) {
		super();
		this.name = "pubnub";
		this.publishKey = publishKey;
		this.subscribeKey = subscribeKey;
		this.userId = userId;
		this.log = log;
		this._pubnub = null;
	}

	async subscribe(channel) {
		const { default: PubNub } = await import("pubnub");

		this._pubnub = new PubNub({
			publishKey: this.publishKey,
			subscribeKey: this.subscribeKey,
			userId: String(this.userId),
			authKey: channel.pubnub_token,
			origin: channel.pubnub_origin || undefined,
			heartbeatInterval: channel.pubnub_heartbeat_interval || 60,
			presenceTimeout: channel.pubnub_heartbeat_value || 60
		});

		this._pubnub.addListener({
			message: ({ message }) => {
				if (!message?.action) {
					return;
				}

				// Every action is emitted, not just the known ones. The old
				// allowlist bought nothing - an action with no handler is a
				// no-op either way - and silently swallowed everything the 2021
				// client never knew about, which is where live chat was found.
				//
				// Logged on whether anything is actually listening, not against
				// a list: handle an action and it stops being reported, with no
				// second place to remember to update.
				if (!this.hasHandlers(message.action)) {
					this.log(`[room:pubnub] no handler for "${message.action}" ${JSON.stringify(message).slice(0, 300)}`);
				}

				this.emit(message.action, message);
			},
			status: event => this.log(`[room:pubnub] ${event.category}`)
		});

		const channels = [
			`channel_all.${channel.channel}`,
			`channel_user.${channel.channel}.${this.userId}`,
			`users.${this.userId}`
		];

		if (channel.is_moderator) {
			channels.push(`channel_speakers.${channel.channel}`);
		}

		this._pubnub.subscribe({ channels });
	}

	async unsubscribe() {
		this._pubnub?.unsubscribeAll();
		this._pubnub?.destroy?.();
		this._pubnub = null;
	}
}

export async function createRoomEvents({ enabled = true, publishKey, subscribeKey, userId, log = () => {} } = {}) {
	if (!enabled || !publishKey || !subscribeKey) {
		return new NullRoomEvents({ log });
	}

	try {
		await import("pubnub");
		return new PubNubRoomEvents({ publishKey, subscribeKey, userId, log });
	} catch (error) {
		log(`[room] pubnub unavailable (${error.message}); live updates off`);
		return new NullRoomEvents({ log });
	}
}

export { ACTIONS };
