<script setup>
/**
 * The activity feed: who followed you, invited you, waved. Each activity is a
 * short list of `details`, each with a title and an avatar; the shape is known
 * only from observation, so titles and avatar urls are read defensively and an
 * activity with neither still renders as a plain line rather than vanishing.
 */
import { onMounted } from "vue";
import { useActivity } from "../composables/useActivity.js";
import AppSpinner from "../components/AppSpinner.vue";
import EmptyState from "../components/EmptyState.vue";

const { activities, cursor, loading, loaded, error, load, loadMore } = useActivity();

/** Whatever url an avatar carries, across the names it might use. */
function avatarUrl(detail) {
	const a = detail?.avatar || {};
	return a.image_url || a.photo_url || a.thumbnail_url || a.url || null;
}

function initial(detail) {
	return (detail?.title || "?").trim().charAt(0).toUpperCase();
}

onMounted(() => {
	// Already loaded by the nav bell as a rule; refresh so the page is current.
	load();
});
</script>

<template>
	<div class="page">
		<h1 class="page__title">Notifications</h1>

		<AppSpinner v-if="loading && !loaded" />
		<p v-else-if="error" class="error-box">{{ error }}</p>
		<EmptyState v-else-if="!activities.length" icon="🔔" message="Nothing new." />

		<ul v-else class="acts">
			<li
				v-for="(activity, i) in activities"
				:key="i"
				class="act"
				:class="{ 'act--unread': activity.is_unread }"
			>
				<template v-for="(detail, j) in activity.details || []" :key="j">
					<span class="act__avatar">
						<img v-if="avatarUrl(detail)" :src="avatarUrl(detail)" alt="" loading="lazy">
						<span v-else class="act__fallback">{{ initial(detail) }}</span>
					</span>
					<p class="act__text">{{ detail.title }}</p>
				</template>
				<span v-if="activity.is_unread" class="act__dot" aria-label="unread" />
			</li>

			<button v-if="cursor" class="btn btn-secondary load-more" :disabled="loading" @click="loadMore">
				{{ loading ? "Loading…" : "Show more" }}
			</button>
		</ul>
	</div>
</template>

<style scoped>
.page {
	padding: 1.25rem;
	max-width: 640px;
	margin: 0 auto;
}

.page__title {
	font-size: 1.3rem;
	margin: 0 0 1.25rem;
}

.acts {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	gap: 0.3rem;
}

.act {
	position: relative;
	display: flex;
	align-items: center;
	gap: 0.7rem;
	padding: 0.7rem 0.85rem;
	background: var(--surface);
	border-radius: var(--radius-sm);
	box-shadow: var(--shadow-sm);
}

.act--unread {
	background: var(--accent-soft);
}

.act__avatar {
	flex: 0 0 auto;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	overflow: hidden;
	background: var(--surface-2);
	display: grid;
	place-items: center;
}

.act__avatar img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.act__fallback {
	font-weight: 700;
	color: var(--text-muted);
}

.act__text {
	flex: 1;
	margin: 0;
	font-size: 0.88rem;
	line-height: 1.4;
	overflow-wrap: anywhere;
}

.act__dot {
	flex: 0 0 auto;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: var(--accent);
}

.load-more {
	margin: 0.75rem auto 0;
}
</style>
