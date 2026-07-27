<script setup>
import { onMounted, ref } from "vue";
import { useApi } from "../composables/useApi.js";
import UserRow from "../components/UserRow.vue";
import AppSpinner from "../components/AppSpinner.vue";

const props = defineProps({ id: { type: [String, Number], required: true } });
const { run, loading } = useApi();
const event = ref(null);

onMounted(async () => {
	const result = await run("getEvent", props.id);
	event.value = result?.event || result || null;
});
</script>

<template>
	<div class="page">
		<AppSpinner v-if="loading" />
		<div v-else-if="event" class="card">
			<h1 class="event__name">{{ event.name }}</h1>
			<p class="muted">{{ event.time_start }}</p>
			<p v-if="event.description" class="event__desc">{{ event.description }}</p>
			<template v-if="event.hosts?.length">
				<h2 class="page__subtitle">Hosts</h2>
				<UserRow v-for="h in event.hosts" :key="h.user_id" :user="h" />
			</template>
		</div>
	</div>
</template>

<style scoped>
.page { padding: 1.25rem; max-width: 640px; margin: 0 auto; }
.page__subtitle { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin: 1.5rem 0 0.5rem; }
.event__name { margin: 0 0 0.25rem; font-size: 1.3rem; }
.event__desc { white-space: pre-wrap; font-size: 0.9rem; margin: 0.75rem 0 0; }
</style>
