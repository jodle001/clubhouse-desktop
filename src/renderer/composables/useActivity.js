import { computed, ref } from "vue";
import { call } from "./useApi.js";

/**
 * The activity feed, shared by the nav bell and the notifications view so both
 * read one source. A module singleton like useSession and useSharedRoom: the
 * unread count the bell shows is the same list the page renders.
 */
const activities = ref([]);
const cursor = ref(null);
const loading = ref(false);
const loaded = ref(false);
const error = ref("");

const unreadCount = computed(() => activities.value.filter(a => a.is_unread).length);

/** First page. Idempotent enough to call from the nav on mount and the view. */
async function load() {
	if (loading.value) {
		return;
	}

	loading.value = true;
	error.value = "";

	try {
		const result = await call("getActivities", {});
		activities.value = result?.activities || [];
		cursor.value = result?.next_cursor || null;
		loaded.value = true;
	} catch (err) {
		error.value = err.message;
	} finally {
		loading.value = false;
	}
}

/** One more page, if the cursor still points somewhere. */
async function loadMore() {
	if (!cursor.value || loading.value) {
		return;
	}

	loading.value = true;

	try {
		const result = await call("getActivities", { cursor: cursor.value });
		const more = result?.activities || [];
		activities.value = [...activities.value, ...more];
		// A page that yields nothing new is the end, whatever the cursor says.
		cursor.value = more.length ? result?.next_cursor || null : null;
	} catch (err) {
		error.value = err.message;
	} finally {
		loading.value = false;
	}
}

export function useActivity() {
	return { activities, cursor, loading, loaded, error, unreadCount, load, loadMore };
}
