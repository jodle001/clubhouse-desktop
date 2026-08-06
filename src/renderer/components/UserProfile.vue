<script setup>
/**
 * Everything about one person, with no opinion about where it sits. Used as a
 * page on its own and as a sheet over a room, so that opening a profile from a
 * room does not mean leaving it.
 */
import { computed, onMounted, ref, watch } from "vue";
import { useApi } from "../composables/useApi.js";
import { useSession } from "../composables/useSession.js";
import { notify } from "../composables/useToast.js";
import AppAvatar from "./AppAvatar.vue";
import AppSpinner from "./AppSpinner.vue";
import UserRow from "./UserRow.vue";

const props = defineProps({
	id: { type: [String, Number], required: true },
	/** Links elsewhere make no sense in a sheet over a room. */
	linkable: { type: Boolean, default: true }
});

const { state } = useSession();
const { run, call, loading } = useApi();

const profile = ref(null);
const busy = ref(false);
const blocked = ref(false);
const confirmingBlock = ref(false);
const mutuals = ref(null);
const loadingMutuals = ref(false);

const isMe = computed(
	() => props.id === "me" || Number(props.id) === state.user?.user_profile?.user_id
);

/** A sent-but-unanswered request to a protected account. */
const requested = computed(() => /request|pending/i.test(profile.value?.follow_status || ""));

/**
 * `follow_status` is the profile's own answer, so it beats inferring the
 * relationship from a list. /me's following_ids is the fallback for a response
 * that omits it.
 *
 * A pending request is *not* following - it must fall through to the
 * "Requested" label, not read as an accepted follow whose button unfollows.
 */
const following = computed(() => {
	const status = profile.value?.follow_status;
	if (status) {
		return status !== "not_following" && !requested.value;
	}

	return Boolean(profile.value?._following);
});

const joined = computed(() => {
	const raw = profile.value?.time_created;
	if (!raw) {
		return "";
	}

	return new Date(raw).toLocaleDateString(undefined, { year: "numeric", month: "long" });
});

const mutualCount = computed(
	() => profile.value?.mutual_follows_count ?? (profile.value?.mutual_follows || []).length
);

/** "Followed by A, B and 21 others" - the phone app's social proof. */
const mutualSummary = computed(() => {
	const people = profile.value?.mutual_follows || [];
	if (!people.length) {
		return "";
	}

	const names = people.slice(0, 2).map(u => u.name);
	const rest = mutualCount.value - names.length;

	if (rest > 0) {
		return `Followed by ${names.join(", ")} and ${rest} other${rest === 1 ? "" : "s"} you follow`;
	}

	return `Followed by ${names.join(" and ")}`;
});

const houses = computed(() => profile.value?.social_clubs || []);

async function load() {
	confirmingBlock.value = false;
	mutuals.value = null;

	/*
	 * Your own profile goes through /get_profile too. /me answers with a stub -
	 * user_id, name, username, photo_url, share_url and nothing else - so
	 * reading it directly rendered a name over zero followers, zero following,
	 * no bio and no houses, which looked like an empty account rather than a
	 * thin response.
	 *
	 * The route can say "me" without knowing the id, so that case waits for /me
	 * to supply one. Any other id is already known and fetches in parallel.
	 */
	// call(), not run(), driven by one loading window we own: two parallel
	// run()s share a single loading ref, and the first to resolve flips it
	// false while the other is still in flight - blanking the view (no spinner,
	// no profile) until the second lands.
	loading.value = true;
	let mine = null;
	let result = null;

	try {
		const known = props.id === "me" ? null : Number(props.id);
		let direct;
		[mine, direct] = await Promise.all([
			call("me").catch(() => null),
			known ? call("getProfile", known) : Promise.resolve(null)
		]);

		const userId = known ?? mine?.user_profile?.user_id;
		result = direct ?? (userId ? await call("getProfile", userId) : null);
	} catch (err) {
		notify({ type: "error", message: err.message });
	} finally {
		loading.value = false;
	}

	const found = result?.user_profile || null;
	const userId = props.id === "me" ? mine?.user_profile?.user_id : Number(props.id);

	if (found) {
		// Whether *we* blocked them is only in /me; the profile's
		// is_blocked_by_network is a different thing entirely.
		found._following = Boolean(mine?.following_ids?.includes(userId));
	}

	profile.value = found;
	blocked.value = Boolean(mine?.blocked_ids?.includes(userId));
}

async function showMutuals() {
	if (mutuals.value) {
		mutuals.value = null;
		return;
	}

	loadingMutuals.value = true;
	const result = await run("getMutualFollows", Number(props.id));
	mutuals.value = result?.users || result?.mutual_follows || [];
	loadingMutuals.value = false;
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
		await load();
	}

	busy.value = false;
}

async function toggleBlock() {
	// Blocking affects someone else and is not obvious to undo, so it asks
	// once. Unblocking is harmless and goes straight through.
	if (!blocked.value && !confirmingBlock.value) {
		confirmingBlock.value = true;
		return;
	}

	busy.value = true;
	const wanted = !blocked.value;
	const result = await run(wanted ? "block" : "unblock", profile.value.user_id);

	if (result) {
		blocked.value = wanted;
		notify({
			type: "success",
			message: wanted ? `Blocked ${profile.value.name}.` : `Unblocked ${profile.value.name}.`
		});
	}

	confirmingBlock.value = false;
	busy.value = false;
}

onMounted(load);
watch(() => props.id, load);
</script>

<template>
	<AppSpinner v-if="loading && !profile" />

	<div v-else-if="profile" class="profile">
		<AppAvatar :user="profile" :size="96" />

		<h1 class="profile__name">{{ profile.name }}</h1>
		<p class="muted">@{{ profile.username }}</p>

		<p v-if="profile.follows_me" class="profile__badge">Follows you</p>

		<!--
			Counts only. /get_followers and /get_following are retired and have
			no replacement, so linking to those lists just produced a 404 - a
			link that cannot work is worse than plain text.
		-->
		<div class="profile__counts">
			<span><strong>{{ profile.num_followers ?? 0 }}</strong> followers</span>
			<span><strong>{{ profile.num_following ?? 0 }}</strong> following</span>
			<span v-if="profile.num_cofollows"><strong>{{ profile.num_cofollows }}</strong> co-follows</span>
		</div>

		<p v-if="profile.bio" class="profile__bio">{{ profile.bio }}</p>

		<button v-if="mutualSummary" class="profile__mutual" :disabled="loadingMutuals" @click="showMutuals">
			<AppAvatar
				v-for="person in (profile.mutual_follows || []).slice(0, 3)"
				:key="person.user_id"
				:user="person"
				:size="22"
			/>
			<span>{{ mutualSummary }}</span>
			<span aria-hidden="true">{{ mutuals ? "▴" : "▾" }}</span>
		</button>

		<div v-if="mutuals" class="profile__mutual-list">
			<UserRow
				v-for="person in mutuals"
				:key="person.user_id"
				:user="person"
				:linkable="linkable"
			/>
			<p v-if="!mutuals.length" class="muted">Nobody in common.</p>
		</div>

		<div v-if="profile.twitter || profile.instagram" class="profile__links">
			<span v-if="profile.twitter">🐦 @{{ profile.twitter }}</span>
			<span v-if="profile.instagram">📷 @{{ profile.instagram }}</span>
		</div>

		<p v-if="houses.length" class="profile__houses">
			<span class="muted">{{ profile.clubs_details_title || "Houses" }}:</span>
			{{ houses.slice(0, 3).map(h => h.name).join(", ") }}
			<span v-if="(profile.social_clubs_count ?? houses.length) > 3" class="muted">
				and {{ (profile.social_clubs_count ?? houses.length) - 3 }} more
			</span>
		</p>

		<p v-if="profile.invited_by_user_profile" class="muted profile__meta">
			Nominated by {{ profile.invited_by_user_profile.name }}
		</p>

		<p v-if="joined" class="muted profile__meta">Joined {{ joined }}</p>

		<p v-if="blocked" class="profile__flag">You have blocked this person.</p>
		<p v-else-if="profile.has_protected_profile" class="muted profile__meta">
			This profile is private — following needs their approval.
		</p>

		<div class="row profile__actions">
			<RouterLink v-if="isMe && linkable" :to="{ name: 'editProfile' }" class="btn btn-secondary">
				Edit profile
			</RouterLink>

			<template v-else-if="!isMe">
				<button class="btn" :disabled="busy || blocked" @click="toggleFollow">
					{{ following ? "Following" : requested ? "Requested" : "Follow" }}
				</button>

				<button
					class="btn btn-secondary"
					:class="{ 'btn-danger': confirmingBlock }"
					:disabled="busy"
					@click="toggleBlock"
				>
					{{ blocked ? "Unblock" : confirmingBlock ? "Really block?" : "Block" }}
				</button>

				<button
					v-if="confirmingBlock"
					class="btn btn-secondary"
					:disabled="busy"
					@click="confirmingBlock = false"
				>
					Cancel
				</button>
			</template>
		</div>
	</div>
</template>

<style scoped>
.profile { text-align: center; display: grid; justify-items: center; gap: 0.35rem; }
.profile__name { margin: 0.6rem 0 0; font-size: 1.25rem; }

.profile__badge {
	margin: 0.25rem 0 0;
	padding: 0.1rem 0.5rem;
	font-size: 0.72rem;
	border-radius: 999px;
	background: var(--surface-2);
	color: var(--text-muted);
}

.profile__counts { display: flex; gap: 1.25rem; margin: 0.75rem 0; font-size: 0.85rem; }
.profile__bio { white-space: pre-wrap; font-size: 0.9rem; text-align: left; margin: 0.5rem 0 0; }

.profile__mutual {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	flex-wrap: wrap;
	justify-content: center;
	margin: 0.75rem 0 0;
	padding: 0.3rem 0.5rem;
	border: 0;
	border-radius: var(--radius-sm);
	background: none;
	cursor: pointer;
	font-size: 0.8rem;
	color: var(--text-muted);
}

.profile__mutual:hover { background: var(--surface-2); }

.profile__mutual-list {
	width: 100%;
	margin-top: 0.4rem;
	max-height: 240px;
	overflow-y: auto;
	text-align: left;
}

.profile__links {
	display: flex;
	gap: 0.9rem;
	margin-top: 0.5rem;
	font-size: 0.85rem;
}

.profile__houses { margin: 0.6rem 0 0; font-size: 0.82rem; }
.profile__meta { margin: 0.3rem 0 0; font-size: 0.8rem; }
.profile__flag { margin: 0.6rem 0 0; font-size: 0.82rem; color: var(--danger); }
.profile__actions { margin-top: 1rem; flex-wrap: wrap; justify-content: center; }
</style>
