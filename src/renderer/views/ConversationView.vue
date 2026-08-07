<script setup>
/**
 * One conversation thread, its posts read in order.
 *
 * A thread is a list of `segments`, oldest first. Each carries `user_text`
 * (what was said or captioned), a `creator_user_profile`, and sometimes a
 * `photo_url`. A segment with a real voice recording has
 * `shared_without_voice: false` and a playable `segment_audio_url`; the far
 * commoner text/photo posts reuse a silent placeholder there, so the player
 * only appears for actual voice.
 */
import { computed, onMounted, ref } from "vue";
import { useApi } from "../composables/useApi.js";
import { relativeTime } from "@shared/time.js";
import AppAvatar from "../components/AppAvatar.vue";
import AppSpinner from "../components/AppSpinner.vue";
import EmptyState from "../components/EmptyState.vue";

const props = defineProps({ id: { type: String, required: true } });

const { run, call, loading } = useApi();
const data = ref(null);

const convo = computed(() => data.value || null);
const segments = computed(() => data.value?.segments || []);

const draft = ref("");
const sending = ref(false);
const replyError = ref("");
/** Set if the server version-gates posting, so the composer retires. */
const replyGated = ref(false);

async function load() {
	data.value = await run("getConversation", props.id);
	// Clear the thread's unread mark now it is on screen; harmless if it fails.
	call("markConversationRead", props.id).catch(() => {});
}

async function reply() {
	const text = draft.value.trim();
	if (!text || sending.value) {
		return;
	}

	sending.value = true;
	replyError.value = "";

	try {
		await call("sendConversationSegment", { conversationId: props.id, text });
		draft.value = "";
		await load();
	} catch (err) {
		// The same version gate that blocks creating a conversation may block
		// posting; say so once and retire the box rather than failing on send.
		if (/upgrade|new chat/i.test(err.message)) {
			replyGated.value = true;
		} else {
			replyError.value = err.message;
		}
	} finally {
		sending.value = false;
	}
}

/** The text of a post: what was typed, or the caption on a voice note. */
function segmentText(seg) {
	return seg.user_text || seg.text || seg.message || "";
}

function segmentAuthor(seg) {
	return seg.creator_user_profile || seg.user_profile || { name: "Someone" };
}

/**
 * A voice recording worth a player, as opposed to the silent placeholder a
 * text/photo post reuses. Only a segment that says it *was* shared without
 * voice is skipped; one that omits the flag but carries audio still gets a
 * player, since dropping a real recording is worse than an occasional silent
 * one.
 */
function segmentVoice(seg) {
	return seg.shared_without_voice !== true && seg.segment_audio_url ? seg.segment_audio_url : null;
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

			<EmptyState v-if="!segments.length" icon="🎧" message="Nothing has been said here yet." />

			<ul v-else class="segments">
				<li v-for="(seg, i) in segments" :key="seg.segment_id || i" class="segment">
					<AppAvatar :user="segmentAuthor(seg)" :size="34" />
					<div class="segment__body">
						<div class="segment__head">
							<strong class="segment__name">{{ segmentAuthor(seg).name || "Someone" }}</strong>
							<span v-if="seg.time_created" class="segment__time muted">
								{{ relativeTime(seg.time_created) }}
							</span>
						</div>

						<p v-if="segmentText(seg)" class="segment__text">{{ segmentText(seg) }}</p>

						<img
							v-if="seg.photo_url"
							:src="seg.photo_url"
							alt=""
							class="segment__photo"
							loading="lazy"
						>

						<audio v-if="segmentVoice(seg)" :src="segmentVoice(seg)" controls preload="none" class="segment__audio" />

						<p v-else-if="!segmentText(seg) && !seg.photo_url" class="segment__text muted">🎙️ Voice reply</p>
					</div>
				</li>
			</ul>

			<form v-if="!replyGated" class="reply" @submit.prevent="reply">
				<input
					v-model="draft"
					class="reply__input"
					placeholder="Write a reply…"
					aria-label="Reply"
					maxlength="1000"
				>
				<button class="btn" type="submit" :disabled="!draft.trim() || sending">Send</button>
			</form>
			<p v-else class="muted reply__gated">
				Replying needs the latest Clubhouse app — this thread is read-only here.
			</p>
			<p v-if="replyError" class="error-box reply__error">{{ replyError }}</p>

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

.segment__head {
	display: flex;
	align-items: baseline;
	gap: 0.5rem;
}

.segment__name {
	font-size: 0.82rem;
}

.segment__time {
	font-size: 0.72rem;
}

.segment__text {
	margin: 0.15rem 0 0;
	font-size: 0.88rem;
	line-height: 1.4;
	overflow-wrap: anywhere;
}

.segment__photo {
	display: block;
	margin-top: 0.4rem;
	max-width: 220px;
	max-height: 220px;
	border-radius: var(--radius-sm);
}

.segment__audio {
	margin-top: 0.4rem;
	height: 32px;
	max-width: 260px;
}

.reply {
	display: flex;
	gap: 0.5rem;
	margin-top: 1.5rem;
}

.reply__input {
	flex: 1;
	min-width: 0;
}

.reply__gated {
	margin-top: 1.5rem;
	font-size: 0.82rem;
	text-align: center;
}

.reply__error {
	margin-top: 0.75rem;
}

.open-web {
	margin-top: 1rem;
}
</style>
