import Store from "electron-store";

const DEFAULTS = {
	theme: "auto",
	country: "US",
	filterNonLatinRooms: false,
	/** Audio is opt-in: see src/renderer/audio for why. */
	audioEnabled: false,
	/** Whether the room's chat panel is open. Remembered between rooms. */
	chatOpen: true,
	windowState: { width: 1100, height: 800, maximized: false }
};

export class Settings {
	constructor(store = new Store({ name: "settings", defaults: DEFAULTS })) {
		this.store = store;
	}

	all() {
		return { ...DEFAULTS, ...this.store.store };
	}

	get(key) {
		return this.store.get(key, DEFAULTS[key]);
	}

	update(patch) {
		// Defensive on both counts: this is an IPC boundary. A non-object
		// patch has nothing to store, and electron-store throws on undefined
		// values - which would reject the invoke and strand the renderer's
		// await, for a call the caller meant as fire-and-forget.
		if (patch && typeof patch === "object" && !Array.isArray(patch)) {
			for (const [key, value] of Object.entries(patch)) {
				if (value !== undefined) {
					this.store.set(key, value);
				}
			}
		}

		return this.all();
	}
}

export { DEFAULTS };
