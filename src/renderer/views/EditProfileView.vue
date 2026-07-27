<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "../composables/useApi.js";
import { notify } from "../composables/useToast.js";
import AppSpinner from "../components/AppSpinner.vue";

const router = useRouter();
const { run, loading } = useApi();

const name = ref("");
const username = ref("");
const bio = ref("");
const saving = ref(false);

onMounted(async () => {
	const result = await run("me");
	const profile = result?.user_profile;
	if (profile) {
		name.value = profile.name || "";
		username.value = profile.username || "";
		bio.value = profile.bio || "";
	}
});

async function save() {
	saving.value = true;
	const results = await Promise.all([
		run("updateName", name.value.trim()),
		run("updateUsername", username.value.trim()),
		run("updateBio", bio.value)
	]);
	saving.value = false;

	const failed = results.find(r => r && r.success === false);
	if (failed) {
		notify({ type: "error", message: failed.error_message || "Some changes were rejected." });
		return;
	}

	notify({ type: "success", message: "Profile updated." });
	router.push({ name: "me" });
}
</script>

<template>
	<div class="page">
		<h1 class="page__title">Edit profile</h1>
		<AppSpinner v-if="loading && !name" />
		<form v-else class="card stack" @submit.prevent="save">
			<label>Name <input v-model="name" maxlength="64"></label>
			<label>Username <input v-model="username" maxlength="32"></label>
			<label>Bio <textarea v-model="bio" rows="5" /></label>
			<div class="row">
				<button class="btn" type="submit" :disabled="saving">Save</button>
				<RouterLink :to="{ name: 'me' }" class="btn btn-secondary">Cancel</RouterLink>
			</div>
		</form>
	</div>
</template>

<style scoped>
.page { padding: 1.25rem; max-width: 520px; margin: 0 auto; }
.page__title { font-size: 1.3rem; margin: 0 0 1rem; }
label { display: grid; gap: 0.3rem; font-size: 0.82rem; color: var(--text-muted); }
textarea { resize: vertical; }
</style>
