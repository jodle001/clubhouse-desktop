<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppNav from "./components/AppNav.vue";
import MiniPlayer from "./components/MiniPlayer.vue";
import ToastHost from "./components/ToastHost.vue";
import { useSession } from "./composables/useSession.js";

const route = useRoute();
const { state } = useSession();

// Sign-in and the waitlist are full-screen; everything else gets the chrome.
const showNav = computed(
	() => state.signedIn && !["login", "verify", "waitlist"].includes(route.name)
);

// The room itself already shows its own controls.
const showMini = computed(() => showNav.value && route.name !== "room");
</script>

<template>
	<div class="app" :class="{ 'app--chrome': showNav }">
		<AppNav v-if="showNav" />
		<main class="app__main">
			<RouterView v-slot="{ Component }">
				<component :is="Component" />
			</RouterView>
		</main>
		<MiniPlayer v-if="showMini" />
		<ToastHost />
	</div>
</template>

<style scoped>
.app {
	min-height: 100vh;
}

.app--chrome {
	display: grid;
	grid-template-rows: auto 1fr;
	height: 100vh;
}

.app--chrome .app__main {
	overflow-y: auto;
}
</style>
