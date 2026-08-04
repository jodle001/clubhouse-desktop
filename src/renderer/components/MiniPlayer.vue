<script setup>
/**
 * The room, while you are somewhere else in the app.
 *
 * Shown whenever a room is live and the room view is not on screen, so
 * browsing the hallway, a profile or Settings never means losing your place -
 * or forgetting you are still audible somewhere.
 */
import { computed } from "vue";
import { useSharedRoom } from "../composables/useRoom.js";
import { useSession } from "../composables/useSession.js";

const room = useSharedRoom();
const { state } = useSession();

const live = computed(() => Boolean(room.channel.info));

const canSpeak = computed(() => state.settings.audioEnabled && room.isSpeaker.value);
</script>

<template>
	<footer v-if="live" class="mini">
		<RouterLink
			:to="{ name: 'room', params: { channel: room.channel.info.channel } }"
			class="mini__topic"
			title="Back to the room"
		>
			<span class="mini__dot" aria-hidden="true" />
			<span class="truncate">{{ room.channel.info.topic || "Untitled room" }}</span>
		</RouterLink>

		<span class="mini__count muted">{{ room.speakers.value.length }} speaking</span>

		<button
			v-if="canSpeak"
			class="btn btn-secondary btn-sm"
			:title="room.muted.value ? 'Unmute' : 'Mute'"
			@click="room.toggleMute()"
		>
			{{ room.muted.value ? "🔇" : "🎙️" }}
		</button>

		<button class="btn btn-danger btn-sm" @click="room.leave()">Leave ✌️</button>
	</footer>
</template>

<style scoped>
.mini {
	position: fixed;
	left: 50%;
	bottom: 1rem;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	gap: 0.75rem;
	max-width: min(560px, calc(100vw - 2rem));
	padding: 0.5rem 0.9rem;
	background: var(--surface);
	border-radius: 999px;
	box-shadow: var(--shadow);
	z-index: 50;
}

.mini__topic {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	min-width: 0;
	font-size: 0.85rem;
	font-weight: 600;
}

.mini__dot {
	flex: 0 0 auto;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: var(--green, #3ba55d);
}

.mini__count {
	flex: 0 0 auto;
	font-size: 0.75rem;
	white-space: nowrap;
}
</style>
