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
				<!-- Quick enough to feel like polish, not like waiting. -->
				<Transition name="page" mode="out-in">
					<component :is="Component" />
				</Transition>
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

.page-enter-active,
.page-leave-active {
	transition: opacity 0.12s ease, transform 0.12s ease;
}

.page-enter-from {
	opacity: 0;
	transform: translateY(4px);
}

.page-leave-to {
	opacity: 0;
}
</style>
