import { vi } from "vitest";

/**
 * The renderer only ever reaches the outside world through window.clubhouse,
 * which the preload provides. Stubbing it here is the whole test seam.
 */
export function stubBridge(overrides = {}) {
	const api = new Proxy(
		{},
		{
			get: (target, prop) =>
				target[prop] || vi.fn().mockResolvedValue({ ok: true, data: { success: true } })
		}
	);

	window.clubhouse = {
		api,
		session: {
			get: vi.fn().mockResolvedValue({ signedIn: false, user: null, services: {} }),
			signIn: vi.fn().mockResolvedValue({ ok: true }),
			signOut: vi.fn().mockResolvedValue({ ok: true })
		},
		settings: {
			get: vi.fn().mockResolvedValue({}),
			set: vi.fn().mockResolvedValue({})
		},
		platform: "linux",
		...overrides
	};

	return window.clubhouse;
}

stubBridge();
