<script setup>
import { onMounted, ref } from "vue";
import { useApi } from "../composables/useApi.js";
import UserRow from "../components/UserRow.vue";
import AppSpinner from "../components/AppSpinner.vue";
import EmptyState from "../components/EmptyState.vue";

const props = defineProps({ id: { type: [String, Number], required: true } });
const { run, loading } = useApi();
const club = ref(null);
const members = ref([]);
const isFollower = ref(false);

async function load() {
	const result = await run("getClub", Number(props.id));
	if (result?.success) {
		club.value = result.club;
		members.value = result.members || [];
		isFollower.value = Boolean(result.is_follower);
	}
}

async function toggleFollow() {
	await run(isFollower.value ? "unfollowClub" : "followClub", Number(props.id));
	await load();
}

onMounted(load);
</script>

<template>
	<div class="page">
		<AppSpinner v-if="loading && !club" />
		<template v-else-if="club">
			<div class="card">
				<h1 class="club__name">{{ club.name }}</h1>
				<p class="muted">{{ club.num_members ?? 0 }} members · {{ club.num_followers ?? 0 }} followers</p>
				<p v-if="club.description" class="club__desc">{{ club.description }}</p>
				<button class="btn" @click="toggleFollow">{{ isFollower ? "Following" : "Follow" }}</button>
			</div>
			<h2 class="page__subtitle">Members</h2>
			<EmptyState v-if="!members.length" message="No members listed." />
			<UserRow v-for="m in members" :key="m.user_id" :user="m" />
		</template>
	</div>
</template>

<style scoped>
.page { padding: 1.25rem; max-width: 640px; margin: 0 auto; }
.page__subtitle { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin: 1.5rem 0 0.5rem; }
.club__name { margin: 0 0 0.25rem; font-size: 1.3rem; }
.club__desc { white-space: pre-wrap; font-size: 0.9rem; margin: 0.75rem 0 1rem; }
</style>
