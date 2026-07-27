<script setup>
import { onMounted, ref, watch } from "vue";
import { useApi } from "../composables/useApi.js";
import UserRow from "../components/UserRow.vue";
import AppSpinner from "../components/AppSpinner.vue";
import EmptyState from "../components/EmptyState.vue";

const props = defineProps({ query: { type: String, required: true } });
const { run, loading } = useApi();
const users = ref([]);

async function search() {
	const result = await run("searchUsers", props.query);
	users.value = result?.users || [];
}

onMounted(search);
watch(() => props.query, search);
</script>

<template>
	<div class="page">
		<h1 class="page__title">Results for “{{ query }}”</h1>
		<AppSpinner v-if="loading" />
		<EmptyState v-else-if="!users.length" icon="🔍" message="Nobody matched that search." />
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
