<script setup>
import { computed, onMounted, ref } from "vue";
import { useApi } from "../composables/useApi.js";
import UserRow from "../components/UserRow.vue";
import AppSpinner from "../components/AppSpinner.vue";
import EmptyState from "../components/EmptyState.vue";

const props = defineProps({
	id: { type: [String, Number], required: true },
	type: { type: String, required: true }
});

const { run, loading } = useApi();
const users = ref([]);
const title = computed(() => (props.type === "followers" ? "Followers" : "Following"));

onMounted(async () => {
	const method = props.type === "followers" ? "getFollowers" : "getFollowing";
	const result = await run(method, Number(props.id));
	users.value = result?.users || [];
});
</script>

<template>
	<div class="page">
		<h1 class="page__title">{{ title }}</h1>
		<AppSpinner v-if="loading" />
		<EmptyState v-else-if="!users.length" :message="`No ${title.toLowerCase()} yet.`" />
		<div v-else class="list">
			<UserRow v-for="u in users" :key="u.user_id" :user="u" />
		</div>
	</div>
</template>

<style scoped>
.page { padding: 1.25rem; max-width: 640px; margin: 0 auto; }
.page__title { font-size: 1.3rem; margin: 0 0 1rem; }
.list { display: grid; gap: 0.25rem; }
</style>
