import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router.js";
import { loadSession } from "./composables/useSession.js";
import { useTheme } from "./composables/useTheme.js";
import "./styles/main.css";

const state = await loadSession();
useTheme().initTheme(state.settings.theme);

createApp(App).use(router).mount("#app");
