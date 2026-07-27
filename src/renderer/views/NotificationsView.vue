<script setup>
import { onMounted, ref } from "vue";
import { useApi } from "../composables/useApi.js";
import AppAvatar from "../components/AppAvatar.vue";
import AppSpinner from "../components/AppSpinner.vue";
import EmptyState from "../components/EmptyState.vue";

const { run, loading } = useApi();
const items = ref([]);

onMounted(async () => {
	const result = await run("getNotifications");
	if (result?.notifications) {
		items.value = result.notifications;
	}
});
</script>

<template>
	<div class="page">
		<h1 class="page__title">Activity</h1>
		<AppSpinner v-if="loading" />
		<EmptyState v-else-if="!items.length" icon="🔔" message="No activity yet." />
		<ul v-else class="list">
			<li v-for="n in items" :key="n.notification_id" class="row">
				<AppAvatar :user="n.user_profile || {}" :size="40" />
				<span class="grow">
					<span>{{ n.message }}</span>
					<small class="muted">{{ n.time_created }}</small>
				</span>
			</li>
		</ul>
	</div>
</template>

<style scoped>
.page { padding: 1.25rem; max-width: 640px; margin: 0 auto; }
.page__title { font-size: 1.3rem; margin: 0 0 1rem; }
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
.list li { padding: 0.6rem; border-radius: var(--radius-sm); background: var(--surface); }
.list small { display: block; font-size: 0.75rem; }
</style>
