<script setup>
/**
 * One conversation thread.
 *
 * The list shape is known; a single thread's shape is not, so this fetches it,
 * logs the shape once (verbose) the way live chat and reactions were mapped,
 * and renders defensively - title and summary for certain, segments if they
 * are where a guess puts them. Once a real shape is logged, the segment
 * rendering here gets written against it rather than around it.
 */
import { computed, onMounted, ref } from "vue";
import { useApi } from "../composables/useApi.js";
import { relativeTime } from "@shared/time.js";
import AppAvatar from "../components/AppAvatar.vue";
import AppSpinner from "../components/AppSpinner.vue";
import EmptyState from "../components/EmptyState.vue";

const props = defineProps({ id: { type: String, required: true } });

const { run, loading } = useApi();
const data = ref(null);

const convo = computed(() => data.value?.conversation || data.value || null);

/** Wherever the thread keeps its posts - a few plausible keys, defensively. */
const segments = computed(
	() => data.value?.segments || convo.value?.segments || data.value?.items || []
);

async function load() {
	const result = await run("getConversation", props.id);

	if (result) {
		// The one line that turns the next run into a proper renderer.
		console.log("[conversation] shape:", JSON.stringify(result).slice(0, 800));
	}

	data.value = result;
}

/** Best-effort text for one segment, whatever shape it turns out to have. */
function segmentText(seg) {
	return seg.text || seg.message || seg.transcription || seg.body || "";
}

function segmentAuthor(seg) {
	return seg.user_profile || seg.author || seg.creator_user_profile || { name: "Someone" };
}

onMounted(load);
</script>

<template>
	<div class="page">
		<RouterLink :to="{ name: 'conversations' }" class="back muted">‹ Chats</RouterLink>

		<AppSpinner v-if="loading && !data" />

		<template v-else-if="convo">
			<header class="head">
				<AppAvatar :user="convo.creator_user_profile || {}" :size="52" />
				<div>
					<h1 class="head__title">{{ convo.title || "Conversation" }}</h1>
					<p v-if="convo.creator_user_profile" class="muted head__by">
						Started by {{ convo.creator_user_profile.name }}
						<span v-if="convo.time_created">· {{ relativeTime(convo.time_created) }}</span>
					</p>
				</div>
			</header>

			<p v-if="convo.summary" class="summary">{{ convo.summary }}</p>

			<EmptyState
				v-if="!segments.length"
				icon="🎧"
				message="This thread's posts aren't readable here yet — open it on Clubhouse to listen."
			/>

			<ul v-else class="segments">
				<li v-for="(seg, i) in segments" :key="seg.segment_id || seg.id || i" class="segment">
					<AppAvatar :user="segmentAuthor(seg)" :size="34" />
					<div class="segment__body">
						<strong class="segment__name">{{ segmentAuthor(seg).name || "Someone" }}</strong>
						<p class="segment__text">{{ segmentText(seg) || "🎙️ Voice reply" }}</p>
					</div>
				</li>
			</ul>

			<a v-if="convo.share_url" :href="convo.share_url" class="btn btn-secondary open-web">
				Open on Clubhouse ↗
			</a>
		</template>

		<EmptyState v-else icon="🤷" message="Couldn't load this conversation." />
	</div>
</template>

<style scoped>
.page {
	padding: 1.25rem;
	max-width: 640px;
	margin: 0 auto;
}

.back {
	display: inline-block;
	margin-bottom: 1rem;
	font-size: 0.85rem;
}

.head {
	display: flex;
	gap: 0.9rem;
	align-items: center;
	margin-bottom: 1rem;
}

.head__title {
	margin: 0;
	font-size: 1.2rem;
	line-height: 1.3;
}

.head__by {
	margin: 0.2rem 0 0;
	font-size: 0.8rem;
}

.summary {
	background: var(--surface);
	border-radius: var(--radius-sm);
	padding: 0.8rem 1rem;
	font-size: 0.88rem;
	line-height: 1.5;
	margin: 0 0 1.25rem;
}

.segments {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	gap: 0.9rem;
}

.segment {
	display: flex;
	gap: 0.6rem;
}

.segment__name {
	font-size: 0.82rem;
}

.segment__text {
	margin: 0.15rem 0 0;
	font-size: 0.88rem;
	line-height: 1.4;
	overflow-wrap: anywhere;
}

.open-web {
	margin-top: 1.5rem;
}
</style>
