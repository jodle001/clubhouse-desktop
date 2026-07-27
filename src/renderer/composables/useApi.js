import { ref } from "vue";
import { notify } from "./useToast.js";

/**
 * Every API call returns { ok, data } | { ok:false, error } from main.
 * `call` unwraps that into either data or a thrown Error, so views can use
 * ordinary try/catch and never inspect the envelope.
 */
export async function call(method, ...args) {
	const fn = window.clubhouse.api[method];
	if (!fn) {
		throw new Error(`Unknown API method: ${method}`);
	}

	const result = await fn(...args);
	if (result.ok) {
		return result.data;
	}

	const error = new Error(result.error?.message || "Request failed");
	error.status = result.error?.status ?? null;
	throw error;
}

/**
 * Wraps a call with loading/error state, and surfaces failures as a toast
 * instead of a silent no-op - the failure mode this codebase kept hitting.
 */
export function useApi() {
	const loading = ref(false);
	const error = ref("");

	async function run(method, ...args) {
		loading.value = true;
		error.value = "";

		try {
			return await call(method, ...args);
		} catch (err) {
			error.value = err.message;
			notify({ type: "error", message: err.message });
			return null;
		} finally {
			loading.value = false;
		}
	}

	return { loading, error, run, call };
}
