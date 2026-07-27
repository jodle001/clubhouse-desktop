import { reactive, readonly } from "vue";

/**
 * Session and settings state, mirrored from the main process.
 * The token itself never crosses the bridge - only whether we have one.
 */
const state = reactive({
	ready: false,
	signedIn: false,
	user: null,
	services: null,
	settings: {}
});

export async function loadSession() {
	const [session, settings] = await Promise.all([
		window.clubhouse.session.get(),
		window.clubhouse.settings.get()
	]);

	state.signedIn = session.signedIn;
	state.user = session.user;
	state.services = session.services;
	state.settings = settings;
	state.ready = true;
	return state;
}

export async function signIn(authResult) {
	await window.clubhouse.session.signIn(authResult);
	state.signedIn = Boolean(authResult?.auth_token);
	state.user = authResult;
}

export async function signOut() {
	await window.clubhouse.session.signOut();
	state.signedIn = false;
	state.user = null;
}

export async function updateSettings(patch) {
	state.settings = await window.clubhouse.settings.set(patch);
	return state.settings;
}

export function useSession() {
	return {
		state: readonly(state),
		loadSession,
		signIn,
		signOut,
		updateSettings
	};
}

/** Raw state, for the router guard which runs outside a component. */
export { state as sessionState };
