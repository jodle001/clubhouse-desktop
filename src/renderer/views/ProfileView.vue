<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useApi } from "../composables/useApi.js";
import { useSession } from "../composables/useSession.js";
import AppAvatar from "../components/AppAvatar.vue";
import AppSpinner from "../components/AppSpinner.vue";

const props = defineProps({ id: { type: [String, Number], required: true } });

const { state } = useSession();
const { run, loading } = useApi();
const profile = ref(null);
const busy = ref(false);
const following = ref(false);

const isMe = computed(
	() => props.id === "me" || Number(props.id) === state.user?.user_profile?.user_id
);

async function load() {
	if (isMe.value) {
		const result = await run("me");
		profile.value = result?.user_profile || null;
		return;
	}

	// Whether we follow someone is decided by /me's following_ids, which is the
	// only authoritative answer available. The old client read
	// `notification_type === 0` off the profile - that is a notification
	// setting, not a relationship, so the button could show either label
	// regardless of the truth and Unfollow could be the first thing offered for
	// a stranger.
	const [result, mine] = await Promise.all([
		run("getProfile", Number(props.id)),
		run("me")
	]);

	profile.value = result?.user_profile || null;
	following.value = Boolean(mine?.following_ids?.includes(Number(props.id)));
}

async function toggleFollow() {
	if (!profile.value) {
		return;
	}

	busy.value = true;
	const wanted = !following.value;
	const result = await run(wanted ? "follow" : "unfollow", profile.value.user_id);

	// run() returns null on failure, having already reported it.
	if (result) {
		following.value = wanted;
	}

	busy.value = false;
}

onMounted(load);
watch(() => props.id, load);
</script>

<template>
	<div class="page">
		<AppSpinner v-if="loading && !profile" />
		<div v-else-if="profile" class="card profile">
			<AppAvatar :user="profile" :size="96" />
			<h1 class="profile__name">{{ profile.name }}</h1>
			<p class="muted">@{{ profile.username }}</p>

			<!--
				Counts only. /get_followers and /get_following are retired and
				have no replacement, so linking to those lists just produced a
				404 - a link that cannot work is worse than plain text.
			-->
			<div class="profile__counts">
				<span><strong>{{ profile.num_followers ?? 0 }}</strong> followers</span>
				<span><strong>{{ profile.num_following ?? 0 }}</strong> following</span>
			</div>

			<p v-if="profile.bio" class="profile__bio">{{ profile.bio }}</p>

			<div class="row profile__actions">
				<RouterLink v-if="isMe" :to="{ name: 'editProfile' }" class="btn btn-secondary">Edit profile</RouterLink>
				<button v-else class="btn" :disabled="busy" @click="toggleFollow">
					{{ following ? "Following" : "Follow" }}
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.page { padding: 1.25rem; max-width: 520px; margin: 0 auto; }
.profile { text-align: center; display: grid; justify-items: center; gap: 0.35rem; }
.profile__name { margin: 0.6rem 0 0; font-size: 1.25rem; }
.profile__counts { display: flex; gap: 1.25rem; margin: 0.75rem 0; font-size: 0.85rem; }
.profile__bio { white-space: pre-wrap; font-size: 0.9rem; text-align: left; margin: 0.5rem 0 0; }
.profile__actions { margin-top: 1rem; }
</style>
