<script setup>
/**
 * The Chats feed - Clubhouse's async voice/text threads, which are the modern
 * app's main surface. Read-only here: /get_conversations serves the list, but
 * creating one answers "please upgrade your app", so there is no compose.
 */
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "../composables/useApi.js";
import { relativeTime } from "@shared/time.js";
import AppAvatar from "../components/AppAvatar.vue";
import AppSpinner from "../components/AppSpinner.vue";
import EmptyState from "../components/EmptyState.vue";

const router = useRouter();
const { run } = useApi();

const conversations = ref([]);
const loading = ref(true);
const loadingMore = ref(false);
const cursor = ref(null);
const showArchived = ref(false);

const visible = computed(() =>
	conversations.value.filter(c => showArchived.value || !c.is_archived)
);

/** The avatar to show: a house's picture for a club thread, else the creator. */
function facePic(c) {
	if (c.social_club?.photo_url) {
		return { photo_url: c.social_club.photo_url, name: c.social_club.name };
	}

	return c.creator_user_profile || { name: c.title };
}

/** The one line under the title: who is in it, or which house it belongs to. */
function context(c) {
	return (
		c.conversation_context?.text ||
		c.social_club_name ||
		c.creator_user_profile?.name ||
		""
	);
}

/** What was last said, or a plain description of the last event. */
function preview(c) {
	if (c.preview_segment_text) {
		return c.preview_segment_text;
	}

	// No text on a voice reply; say what kind of thing it was instead.
	switch (c.preview_segment_type) {
		case "VOICE_REPLY":
			return "🎙️ Voice reply";
		case "TEXT_TO_SPEECH":
			return "💬 Message";
		case "SYSTEM_MESSAGE":
			return "Activity";
		default:
			return "";
	}
}

function ingest(result) {
	const rows = result?.conversations || [];
	const seen = new Set(conversations.value.map(c => c.conversation_id));

	for (const row of rows) {
		if (!seen.has(row.conversation_id)) {
			conversations.value.push(row);
		}
	}

	cursor.value = result?.next_cursor || null;
	return rows.length;
}

async function loadFirst() {
	loading.value = true;
	const result = await run("getConversations");
	conversations.value = [];
	if (result) {
		ingest(result);
	}
	loading.value = false;
}

async function loadMore() {
	if (loadingMore.value || !cursor.value) {
		return;
	}

	loadingMore.value = true;
	const before = conversations.value.length;
	const result = await run("getConversations", { cursor: cursor.value });

	// A page that added nothing new is the end, whatever the cursor claimed.
	if (result && (ingest(result) === 0 || conversations.value.length === before)) {
		cursor.value = null;
	}

	loadingMore.value = false;
}

function open(c) {
	router.push({ name: "conversation", params: { id: c.conversation_id } });
}

onMounted(loadFirst);
</script>

<template>
	<div class="page">
		<header class="page__head">
			<h1 class="page__title">Chats</h1>
			<label class="page__archived">
				<input v-model="showArchived" type="checkbox">
				<span>Show archived</span>
			</label>
		</header>

		<AppSpinner v-if="loading" />

		<template v-else>
			<!--
				Emptiness is judged on what is visible, but Show more stays
				reachable regardless: a first page of only archived threads
				must not strand a cursor that later pages could still fill.
			-->
			<EmptyState v-if="!visible.length" icon="💬" message="No conversations." />

			<ul v-if="visible.length" class="convos">
				<li
					v-for="c in visible"
					:key="c.conversation_id"
					class="convo"
					:class="{ 'convo--new': c.has_new_segments }"
					tabindex="0"
					role="button"
					@click="open(c)"
					@keyup.enter="open(c)"
				>
					<AppAvatar :user="facePic(c)" :size="46" />
					<div class="convo__body">
						<div class="convo__top">
							<span class="convo__title truncate">{{ c.title || "Untitled" }}</span>
							<span class="convo__time muted">{{ relativeTime(c.time_content_updated) }}</span>
						</div>
						<p class="convo__context muted truncate">{{ context(c) }}</p>
						<p class="convo__preview truncate">{{ preview(c) }}</p>
					</div>
					<span v-if="c.has_new_segments" class="convo__dot" aria-label="New" />
				</li>
			</ul>

			<button v-if="cursor" class="btn btn-secondary load-more" :disabled="loadingMore" @click="loadMore">
				{{ loadingMore ? "Loading…" : "Show more" }}
			</button>
		</template>
	</div>
</template>

<style scoped>
.page {
	padding: 1.25rem;
	max-width: 640px;
	margin: 0 auto;
}

.page__head {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	margin-bottom: 1rem;
}

.page__title {
	font-size: 1.3rem;
	margin: 0;
}

.page__archived {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	font-size: 0.8rem;
	color: var(--text-muted);
}

.page__archived input {
	width: auto;
}

.convos {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	gap: 0.15rem;
}

.convo {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.6rem 0.5rem;
	border-radius: var(--radius-sm);
	cursor: pointer;
}

.convo:hover,
.convo:focus-visible {
	background: var(--surface-2);
	outline: none;
}

.convo__body {
	min-width: 0;
	flex: 1;
}

.convo__top {
	display: flex;
	align-items: baseline;
	gap: 0.5rem;
}

.convo__title {
	font-weight: 600;
	font-size: 0.9rem;
	flex: 1;
}

.convo--new .convo__title {
	font-weight: 700;
}

.convo__time {
	flex: 0 0 auto;
	font-size: 0.72rem;
}

.convo__context {
	margin: 0.1rem 0 0;
	font-size: 0.76rem;
}

.convo__preview {
	margin: 0.15rem 0 0;
	font-size: 0.82rem;
	color: var(--text-muted);
}

.convo__dot {
	flex: 0 0 auto;
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--accent);
}

.load-more {
	margin: 0.75rem auto 0;
}
</style>
