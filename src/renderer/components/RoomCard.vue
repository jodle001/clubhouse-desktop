<script setup>
import AppAvatar from "./AppAvatar.vue";

defineProps({
	room: { type: Object, required: true }
});
</script>

<template>
	<RouterLink :to="{ name: 'room', params: { channel: room.channel } }" class="room-card">
		<h3 class="room-card__topic">{{ room.topic || "Untitled room" }}</h3>
		<div class="room-card__people">
			<AppAvatar v-for="u in (room.users || []).slice(0, 4)" :key="u.user_id" :user="u" :size="30" />
			<span class="grow" />
		</div>
		<ul class="room-card__names">
			<li v-for="u in (room.users || []).slice(0, 3)" :key="u.user_id" class="truncate">
				{{ u.name }}<span v-if="u.is_moderator" aria-label="moderator"> ✳️</span>
			</li>
		</ul>
		<footer class="room-card__meta muted">
			<span>👥 {{ room.num_all ?? 0 }}</span>
			<span>💬 {{ room.num_speakers ?? 0 }}</span>
			<span v-if="room.is_private">🔒 private</span>
		</footer>
	</RouterLink>
</template>

<style scoped>
.room-card {
	display: block;
	background: var(--surface);
	border-radius: 20px;
	padding: 1rem 1.1rem;
	box-shadow: var(--shadow-sm);
	transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.room-card:hover {
	transform: translateY(-2px);
	box-shadow: var(--shadow);
}

.room-card__topic {
	margin: 0 0 0.6rem;
	font-size: 1rem;
	line-height: 1.3;
}

/* The hallway's overlapping cluster of heads, not a row of gaps. */
.room-card__people {
	display: flex;
	margin-bottom: 0.5rem;
}

.room-card__people :deep(.avatar) {
	border: 2px solid var(--surface);
	border-radius: 50%;
}

.room-card__people :deep(.avatar:not(:first-child)) {
	margin-left: -8px;
}

.room-card__names {
	list-style: none;
	margin: 0 0 0.6rem;
	padding: 0;
	font-size: 0.82rem;
	color: var(--text-muted);
}

.room-card__meta {
	display: flex;
	gap: 0.9rem;
	font-size: 0.78rem;
}
</style>
