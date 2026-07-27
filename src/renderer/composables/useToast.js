import { reactive } from "vue";

/** Replaces vue-toastr, which is Vue 2 only. */
const state = reactive({ items: [] });
let nextId = 1;

export function notify({ type = "info", title = "", message = "", timeout = 5000 } = {}) {
	// A failing call on a 30-second poll would otherwise stack the same message
	// forever. Repeat it as a count on the toast already showing.
	const showing = state.items.find(item => item.message === message && item.type === type);
	if (showing) {
		showing.repeats = (showing.repeats || 1) + 1;
		return showing.id;
	}

	const id = nextId++;
	state.items.push({ id, type, title, message, repeats: 1 });

	if (timeout > 0) {
		setTimeout(() => dismiss(id), timeout);
	}

	return id;
}

export function dismiss(id) {
	const index = state.items.findIndex(item => item.id === id);
	if (index !== -1) {
		state.items.splice(index, 1);
	}
}

export function useToast() {
	return { toasts: state, notify, dismiss };
}
