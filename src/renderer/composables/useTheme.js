import { ref, watch } from "vue";
import { updateSettings } from "./useSession.js";

export const THEMES = ["auto", "light", "dark"];

const theme = ref("auto");
const media = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: dark)") : null;

function apply() {
	const resolved =
		theme.value === "auto" ? (media?.matches ? "dark" : "light") : theme.value;
	document.documentElement.dataset.theme = resolved;
}

media?.addEventListener?.("change", () => {
	if (theme.value === "auto") {
		apply();
	}
});

watch(theme, apply);

export function useTheme() {
	function setTheme(next) {
		if (!THEMES.includes(next)) {
			return;
		}

		theme.value = next;
		apply();
		updateSettings({ theme: next });
	}

	function initTheme(saved) {
		theme.value = THEMES.includes(saved) ? saved : "auto";
		apply();
	}

	return { theme, setTheme, initTheme, THEMES };
}
