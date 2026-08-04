import { vi } from "vitest";
import { endpoints } from "../src/shared/api/endpoints.js";

/**
 * The renderer only ever reaches the outside world through window.clubhouse,
 * which the preload provides. Stubbing it here is the whole test seam.
 */
export function stubBridge(overrides = {}) {
	// Only methods the real bridge has. The old Proxy fabricated *any* name,
	// so a view calling an endpoint that no longer exists passed every test
	// and died in the app - the seam was hiding the exact drift it sat on.
	const api = new Proxy(
		{},
		{
			get: (target, prop) => {
				if (target[prop]) {
					return target[prop];
				}

				if (typeof prop === "string" && Object.hasOwn(endpoints, prop)) {
					return (target[prop] = vi.fn().mockResolvedValue({ ok: true, data: { success: true } }));
				}

				return target[prop];
			}
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
