<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "../composables/useApi.js";
import { useSession } from "../composables/useSession.js";
import { notify } from "../composables/useToast.js";
import { isLatin } from "@shared/text.js";
import RoomCard from "../components/RoomCard.vue";
import AppSpinner from "../components/AppSpinner.vue";
import EmptyState from "../components/EmptyState.vue";

const router = useRouter();
const { state } = useSession();
const { run } = useApi();

const rooms = ref([]);
const topics = ref([]);
const loading = ref(true);
const filter = ref("");
const creating = ref(false);
const newTopic = ref("");

let timer = null;

const visibleRooms = computed(() => {
	const needle = filter.value.trim().toLowerCase();
	return rooms.value.filter(room => {
		if (state.settings.filterNonLatinRooms && !isLatin(room.topic)) {
			return false;
		}

		if (!needle) {
			return true;
		}

		const haystack = [room.topic, ...(room.users || []).map(u => u.name)].join(" ").toLowerCase();
		return haystack.includes(needle);
	});
});

/**
 * The feed returns a list of items, each wrapping a live room under `channel`.
 * Other item kinds may appear, so take the rooms and ignore the rest rather
 * than assuming every item has one.
 */
function roomsFromFeed(feed) {
	return (feed?.items || []).map(item => item.channel).filter(Boolean);
}

async function refresh() {
	const feed = await run("getFeed");
	if (!feed) {
		loading.value = false;
		return;
	}

	rooms.value = roomsFromFeed(feed);
	topics.value = feed.available_topics || [];
	loading.value = false;
}

async function createRoom() {
	const result = await run("createChannel", { topic: newTopic.value.trim() });
	if (result?.success) {
		creating.value = false;
		newTopic.value = "";
		router.push({ name: "room", params: { channel: result.channel } });
	} else if (result) {
		notify({ type: "error", message: result.error_message || "Could not create the room." });
	}
}

onMounted(async () => {
	await refresh();

	// One interval, cleared on unmount. The old app started several and
	// retried on failure with no delay.
	timer = setInterval(refresh, 30000);
});

onUnmounted(() => clearInterval(timer));
</script>

<template>
	<div class="home">
		<aside class="home__side">
			<h2 class="home__heading">Topics</h2>
			<EmptyState v-if="!topics.length" message="No topics right now." />
			<ul v-else class="home__topics">
				<li v-for="topic in topics" :key="topic.key" class="truncate">{{ topic.display_name }}</li>
			</ul>
		</aside>

		<section class="home__rooms">
			<header class="home__toolbar">
				<input v-model="filter" type="search" placeholder="Filter rooms" aria-label="Filter rooms">
				<button class="btn" @click="creating = !creating">＋ Room</button>
			</header>

			<form v-if="creating" class="home__create card" @submit.prevent="createRoom">
				<input v-model="newTopic" placeholder="What do you want to talk about?" aria-label="Room topic">
				<div class="row">
					<button class="btn" type="submit">Start room</button>
					<button class="btn btn-secondary" type="button" @click="creating = false">Cancel</button>
				</div>
			</form>

			<AppSpinner v-if="loading" />
			<EmptyState v-else-if="!visibleRooms.length" icon="🫙" message="No rooms match right now." />
			<div v-else class="home__grid">
				<RoomCard v-for="room in visibleRooms" :key="room.channel" :room="room" />
			</div>
		</section>
	</div>
</template>

<style scoped>
.home {
	display: grid;
	grid-template-columns: 220px minmax(0, 1fr);
	gap: 1.25rem;
	padding: 1.25rem;
	align-items: start;
}

@media (max-width: 1000px) {
	.home {
		grid-template-columns: minmax(0, 1fr);
	}

	.home__side {
		display: none;
	}
}

.home__heading {
	font-size: 0.78rem;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: var(--text-muted);
	margin: 0.35rem 0 0.6rem;
}

.home__toolbar {
	display: flex;
	gap: 0.6rem;
	margin-bottom: 1rem;
}

.home__create {
	padding: 1rem;
	margin-bottom: 1rem;
	display: grid;
	gap: 0.6rem;
}

.home__grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
	gap: 0.9rem;
}

.home__topics {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-wrap: wrap;
	gap: 0.35rem;
	font-size: 0.8rem;
	color: var(--text-muted);
	text-transform: capitalize;
}

/* Chips, like the phone's interest picker - read-only here, but the same
   shape makes them scan as topics rather than a mystery list. */
.home__topics li {
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: 999px;
	padding: 0.25rem 0.7rem;
	max-width: 100%;
}

</style>
