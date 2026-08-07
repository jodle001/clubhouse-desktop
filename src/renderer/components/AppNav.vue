<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useSession } from "../composables/useSession.js";
import { useSharedRoom } from "../composables/useRoom.js";
import { useActivity } from "../composables/useActivity.js";

const router = useRouter();
const { state, signOut } = useSession();
const room = useSharedRoom();
const { unreadCount, load: loadActivity } = useActivity();
const query = ref("");

// The bell's dot: load the activity feed once when the chrome mounts.
onMounted(loadActivity);

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
			<RouterLink :to="{ name: 'discover' }" class="btn btn-secondary btn-sm">Discover</RouterLink>
			<RouterLink :to="{ name: 'conversations' }" class="btn btn-secondary btn-sm">Chats</RouterLink>
			<RouterLink :to="{ name: 'people' }" class="btn btn-secondary btn-sm">People</RouterLink>
			<RouterLink
				:to="{ name: 'notifications' }"
				class="btn btn-secondary btn-sm nav__bell"
				title="Notifications"
				aria-label="Notifications"
			>
				🔔
				<span v-if="unreadCount" class="nav__badge">{{ unreadCount > 9 ? "9+" : unreadCount }}</span>
			</RouterLink>
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

.nav__bell {
	position: relative;
	padding-left: 0.7rem;
	padding-right: 0.7rem;
}

.nav__badge {
	position: absolute;
	top: -5px;
	right: -5px;
	min-width: 17px;
	height: 17px;
	padding: 0 4px;
	border-radius: 999px;
	background: var(--danger);
	color: #fff;
	font-size: 0.64rem;
	font-weight: 700;
	line-height: 17px;
	text-align: center;
}

/* Where you are, said by the nav itself. vue-router marks the link whose
   route is active; the pill picks up the accent tint. */
.nav__actions .router-link-active {
	background: var(--accent-soft);
	color: var(--accent);
	box-shadow: none;
	font-weight: 700;
}

:root[data-theme="dark"] .nav__actions .router-link-active {
	color: var(--text);
}
</style>
