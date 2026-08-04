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

/** What the server currently has, so saving only sends what changed. */
const original = { name: "", username: "", bio: "" };

onMounted(async () => {
	const result = await run("me");
	const profile = result?.user_profile;
	if (profile) {
		name.value = original.name = profile.name || "";
		username.value = original.username = profile.username || "";
		bio.value = original.bio = profile.bio || "";
	}
});

async function save() {
	saving.value = true;

	// Only the fields that changed. Clubhouse limits how often a name or
	// username may change, so re-submitting an untouched one risks spending
	// that allowance on nothing.
	const wanted = [];
	if (name.value.trim() !== original.name) {
		wanted.push(run("updateName", name.value.trim()));
	}
	if (username.value.trim() !== original.username) {
		wanted.push(run("updateUsername", username.value.trim()));
	}
	if (bio.value !== original.bio) {
		wanted.push(run("updateBio", bio.value));
	}

	const results = await Promise.all(wanted);
	saving.value = false;

	// run() returns null on failure, having already shown the error as a
	// toast. (It never resolves to { success: false } - the client throws on
	// that before run sees it.) Stay here so the rejected edit is still in
	// the form to fix, rather than announcing success and discarding it.
	if (results.some(r => r === null)) {
		return;
	}

	if (results.length) {
		notify({ type: "success", message: "Profile updated." });
	}
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
