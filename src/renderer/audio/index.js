/**
 * Audio is a port with swappable adapters, so nothing else in the app depends
 * on a particular SDK - or on audio working at all.
 *
 * Clubhouse hosts its rooms on Agora: `join_channel` returns an Agora token for
 * an Agora channel under Clubhouse's own App ID. That means the transport is
 * not ours to choose - but which SDK talks to it, and whether one is loaded at
 * all, is.
 *
 *   NullAudioEngine   default. No SDK, no network, no microphone.
 *   AgoraAudioEngine  lazy-loads agora-rtc-sdk-ng only when audio is enabled.
 *   FakeAudioEngine   records calls, for tests.
 */

/**
 * @typedef {object} AudioEngine
 * @property {(opts: {appId: string, channel: string, token: string, uid: number}) => Promise<void>} join
 * @property {() => Promise<void>} leave
 * @property {(muted: boolean) => Promise<void>} setMuted
 * @property {() => boolean} isMuted
 * @property {(event: string, handler: Function) => void} on
 * @property {() => Promise<void>} destroy
 */

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
}

/** Does nothing, successfully. The app is fully usable minus sound. */
export class NullAudioEngine extends Emitter {
	constructor({ log = () => {} } = {}) {
		super();
		this.name = "null";
		this._muted = true;
		this._joined = null;
		this.log = log;
	}

	async join({ channel }) {
		this._joined = channel;
		this.log(`[audio:null] pretending to join ${channel}`);
		this.emit("joined", { channel });
	}

	async leave() {
		this.log(`[audio:null] pretending to leave ${this._joined}`);
		this._joined = null;
		this.emit("left", {});
	}

	async setMuted(muted) {
		this._muted = Boolean(muted);
		this.emit("muted", { muted: this._muted });
	}

	/**
	 * A fresh Agora token. Clubhouse issues one per role, so the token handed
	 * out at join time only permits listening.
	 */
	async renewToken(token) {
		this._token = token;
	}

	/**
	 * Speaker or listener. Agora's live mode starts everybody as audience, and
	 * an audience member cannot publish - so being promoted to speaker means
	 * nothing until the role changes too.
	 */
	async setRole(role) {
		this._role = role;
		this.log(`[audio:${this.name}] role ${role}`);
	}

	role() {
		return this._role || "audience";
	}

	isMuted() {
		return this._muted;
	}

	isJoined() {
		return this._joined !== null;
	}

	async destroy() {
		this._joined = null;
	}
}

/** Records every call, so room flows can be asserted without an SDK. */
export class FakeAudioEngine extends NullAudioEngine {
	constructor(options) {
		super(options);
		this.name = "fake";
		this.calls = [];
	}

	async join(opts) {
		this.calls.push(["join", opts]);
		return super.join(opts);
	}

	async setRole(role) {
		this.calls.push(["setRole", role]);
		return super.setRole(role);
	}

	async renewToken(token) {
		this.calls.push(["renewToken", token]);
		return super.renewToken(token);
	}

	async leave() {
		this.calls.push(["leave"]);
		return super.leave();
	}

	async setMuted(muted) {
		this.calls.push(["setMuted", muted]);
		return super.setMuted(muted);
	}
}

/**
 * Real audio. The SDK is imported lazily so that a missing or broken
 * agora-rtc-sdk-ng cannot stop the app from starting.
 */
export class AgoraAudioEngine extends Emitter {
	constructor({ log = () => {} } = {}) {
		super();
		this.name = "agora";
		this.log = log;
		this._client = null;
		this._track = null;
		this._muted = true;
		this._joined = null;
	}

	async _sdk() {
		const module = await import("agora-rtc-sdk-ng");
		return module.default || module;
	}

	async join({ appId, channel, token, uid }) {
		const AgoraRTC = await this._sdk();
		AgoraRTC.setLogLevel(3);

		this._client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

		this._client.on("user-published", async (user, mediaType) => {
			if (mediaType !== "audio") {
				return;
			}

			await this._client.subscribe(user, mediaType);
			user.audioTrack?.play();
			this.emit("remote-joined", { uid: user.uid });
		});

		this._client.on("user-unpublished", user => this.emit("remote-left", { uid: user.uid }));

		this._client.enableAudioVolumeIndicator();
		this._client.on("volume-indicator", volumes => {
			this.emit(
				"speaking",
				volumes.filter(v => v.level > 5).map(v => ({ uid: v.uid, level: v.level }))
			);
		});

		await this._client.join(appId, channel, token || null, uid);
		this._joined = channel;
		this.emit("joined", { channel });
	}

	async renewToken(token) {
		if (!token || !this._client) {
			return;
		}

		this._token = token;
		await this._client.renewToken(token);
		this.log("[audio:agora] token renewed");
	}

	async setRole(role) {
		this._role = role;
		await this._client?.setClientRole(role === "host" ? "host" : "audience");
		this.log(`[audio:agora] role ${role}`);
	}

	role() {
		return this._role || "audience";
	}

	async setMuted(muted) {
		const AgoraRTC = await this._sdk();

		if (muted) {
			if (this._track) {
				await this._client?.unpublish([this._track]);
				this._track.close();
				this._track = null;
			}
		} else if (!this._track) {
			this._track = await AgoraRTC.createMicrophoneAudioTrack();
			await this._client?.publish([this._track]);
		}

		this._muted = Boolean(muted);
		this.emit("muted", { muted: this._muted });
	}

	isMuted() {
		return this._muted;
	}

	isJoined() {
		return this._joined !== null;
	}

	async leave() {
		await this.setMuted(true);
		await this._client?.leave();
		this._joined = null;
		this.emit("left", {});
	}

	async destroy() {
		try {
			await this.leave();
		} catch {
			// leaving a room we were never in is not an error worth surfacing
		}

		this._client = null;
	}
}

/**
 * Picks an engine. Audio is opt-in: without an explicit preference the app runs
 * silent rather than pulling in an SDK that may not work.
 */
export async function createAudioEngine({ enabled = false, log = () => {} } = {}) {
	if (!enabled) {
		return new NullAudioEngine({ log });
	}

	try {
		await import("agora-rtc-sdk-ng");
		return new AgoraAudioEngine({ log });
	} catch (error) {
		log(`[audio] agora-rtc-sdk-ng unavailable (${error.message}); running silent`);
		return new NullAudioEngine({ log });
	}
}
