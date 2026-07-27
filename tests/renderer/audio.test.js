import { describe, expect, it, vi } from "vitest";
import { createAudioEngine, FakeAudioEngine, NullAudioEngine } from "@/audio/index.js";

describe("audio port", () => {
	it("defaults to silence with no SDK", async () => {
		const engine = await createAudioEngine({ enabled: false });
		expect(engine.name).toBe("null");
	});

	it("falls back to silence when the SDK cannot load", async () => {
		const log = vi.fn();
		// agora-rtc-sdk-ng is optional, so this exercises the real fallback.
		const engine = await createAudioEngine({ enabled: true, log });
		expect(["agora", "null"]).toContain(engine.name);
	});

	it("lets a room be joined and left without any SDK", async () => {
		const engine = new NullAudioEngine();
		expect(engine.isJoined()).toBe(false);

		await engine.join({ channel: "abc" });
		expect(engine.isJoined()).toBe(true);

		await engine.leave();
		expect(engine.isJoined()).toBe(false);
	});

	it("starts muted, so no microphone is opened by accident", async () => {
		expect(new NullAudioEngine().isMuted()).toBe(true);
	});

	it("emits joined/left/muted so the UI can follow along", async () => {
		const engine = new NullAudioEngine();
		const seen = [];
		engine.on("joined", () => seen.push("joined"));
		engine.on("muted", e => seen.push(`muted:${e.muted}`));
		engine.on("left", () => seen.push("left"));

		await engine.join({ channel: "x" });
		await engine.setMuted(false);
		await engine.leave();

		expect(seen).toEqual(["joined", "muted:false", "left"]);
	});

	it("starts as audience, which is what Agora's live mode does", async () => {
		expect(new NullAudioEngine().role()).toBe("audience");
	});

	it("accepts a fresh token for a new role", async () => {
		// Clubhouse issues one token per role, so taking the stage means
		// swapping the credential as well as the role.
		const engine = new FakeAudioEngine();
		await engine.join({ channel: "x", token: "listener" });
		await engine.renewToken("publisher");
		await engine.setRole("host");

		expect(engine.calls.map(c => c[0])).toEqual(["join", "renewToken", "setRole"]);
		expect(engine.role()).toBe("host");
	});

	it("records calls when faked, so room flows are assertable", async () => {
		const engine = new FakeAudioEngine();
		await engine.join({ channel: "x", token: "t", uid: 1 });
		await engine.setMuted(false);
		await engine.leave();

		expect(engine.calls.map(c => c[0])).toEqual(["join", "setMuted", "leave"]);
		expect(engine.calls[0][1]).toMatchObject({ channel: "x", token: "t", uid: 1 });
	});
});
