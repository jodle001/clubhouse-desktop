<script setup>
/**
 * People to follow.
 *
 * The feed is follow-driven and there is no public room directory, so who you
 * follow is the only lever on how full the hallway is. The old follower and
 * following lists are retired with no replacement; /get_suggested_follows_all
 * is what remains, and it paginates.
 */
import { onMounted, ref } from "vue";
import { useApi } from "../composables/useApi.js";
import UserRow from "../components/UserRow.vue";
import AppSpinner from "../components/AppSpinner.vue";
import EmptyState from "../components/EmptyState.vue";

const { run } = useApi();

const people = ref([]);
const loading = ref(true);
const loadingMore = ref(false);
const page = ref(1);
const done = ref(false);
/** user_id -> true while its follow request is in flight. */
const pending = ref({});

function ingest(result) {
	const users = result?.users || [];
	const seen = new Set(people.value.map(u => u.user_id));

	for (const user of users) {
		if (!seen.has(user.user_id)) {
			people.value.push({ ...user, _following: Boolean(user.follow_status && user.follow_status !== "not_following") });
		}
	}

	// No next page reported, or a page that added nobody new, is the end.
	done.value = !result?.next && !result?.next_sequence ? true : users.length === 0;
}

async function loadFirst() {
	loading.value = true;
	const result = await run("getSuggestedFollows", { page: 1 });
	people.value = [];
	if (result) {
		ingest(result);
	}
	page.value = 1;
	loading.value = false;
}

async function loadMore() {
	if (loadingMore.value || done.value) {
		return;
	}

	loadingMore.value = true;
	const next = page.value + 1;
	const result = await run("getSuggestedFollows", { page: next });

	if (result) {
		const before = people.value.length;
		ingest(result);
		// A page that grew the list advances the cursor; one that did not is
		// the end, whatever the response claimed.
		if (people.value.length > before) {
			page.value = next;
		} else {
			done.value = true;
		}
	}

	loadingMore.value = false;
}

async function toggleFollow(user) {
	pending.value = { ...pending.value, [user.user_id]: true };
	const wanted = !user._following;
	const result = await run(wanted ? "follow" : "unfollow", user.user_id);

	if (result) {
		user._following = wanted;
	}

	const next = { ...pending.value };
	delete next[user.user_id];
	pending.value = next;
}

onMounted(loadFirst);
</script>

<template>
	<div class="page">
		<h1 class="page__title">People to follow</h1>
		<p class="muted page__sub">
			The home screen shows rooms your follows and houses are in, so following more
			people is what fills it out.
		</p>

		<AppSpinner v-if="loading" />
		<EmptyState v-else-if="!people.length" icon="🧭" message="No suggestions right now." />

		<div v-else class="list">
			<UserRow v-for="user in people" :key="user.user_id" :user="user" :subtitle="user.bio || ''">
				<button
					class="btn btn-sm"
					:class="{ 'btn-secondary': user._following }"
					:disabled="pending[user.user_id]"
					@click.prevent="toggleFollow(user)"
				>
					{{ user._following ? "Following" : "Follow" }}
				</button>
			</UserRow>

			<button v-if="!done" class="btn btn-secondary load-more" :disabled="loadingMore" @click="loadMore">
				{{ loadingMore ? "Loading…" : "Show more" }}
			</button>
		</div>
	</div>
</template>

<style scoped>
.page {
	padding: 1.25rem;
	max-width: 640px;
	margin: 0 auto;
}

.page__title {
	font-size: 1.3rem;
	margin: 0;
}

.page__sub {
	font-size: 0.85rem;
	margin: 0.35rem 0 1.25rem;
}

.list {
	display: grid;
	gap: 0.25rem;
}

.load-more {
	margin: 0.75rem auto 0;
}
</style>
