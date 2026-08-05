<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSession } from "../composables/useSession.js";
import { useSharedRoom } from "../composables/useRoom.js";

const router = useRouter();
const { state, signOut } = useSession();
const room = useSharedRoom();
const query = ref("");

function search() {
	const q = query.value.trim();
	if (q) {
		router.push({ name: "search", params: { query: q } });
	}
}

async function logout() {
	// Hang up before handing back the token; the room outlives navigation now,
	// so nothing else will.
	await room.leave().catch(() => {});
	await signOut();
	router.push({ name: "login" });
}
</script>

<template>
	<header class="nav">
		<RouterLink :to="{ name: 'home' }" class="nav__brand">
			<span class="nav__wave">👋</span>
			<span>
				<strong>Clubhouse</strong>
				<small class="muted">Unofficial desktop client</small>
			</span>
		</RouterLink>

		<form class="nav__search" @submit.prevent="search">
			<input v-model="query" type="search" placeholder="Search people" aria-label="Search people">
		</form>

		<nav class="nav__actions">
			<RouterLink :to="{ name: 'people' }" class="btn btn-secondary btn-sm">People</RouterLink>
			<RouterLink :to="{ name: 'me' }" class="btn btn-secondary btn-sm">
				{{ state.user?.user_profile?.name || "Me" }}
			</RouterLink>
			<RouterLink :to="{ name: 'settings' }" class="btn btn-secondary btn-sm">Settings</RouterLink>
			<button class="btn btn-sm" @click="logout">Log out</button>
		</nav>
	</header>
</template>

<style scoped>
.nav {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0.75rem 1.25rem;
	background: var(--surface);
	border-bottom: 1px solid var(--border);
}

.nav__brand {
	display: flex;
	align-items: center;
	gap: 0.6rem;
}

.nav__wave {
	font-size: 1.6rem;
}

.nav__brand small {
	display: block;
	font-size: 0.72rem;
}

.nav__search {
	flex: 1;
	max-width: 420px;
}

.nav__actions {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-left: auto;
}
</style>
