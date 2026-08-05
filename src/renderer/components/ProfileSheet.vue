<script setup>
/**
 * A profile shown over whatever you were doing, rather than instead of it.
 * Opening one from a room used to navigate away, which unmounts the room and
 * leaves the channel - so looking somebody up meant walking out.
 */
import { onMounted, onUnmounted } from "vue";
import UserProfile from "./UserProfile.vue";

defineProps({ id: { type: [String, Number], required: true } });
const emit = defineEmits(["close"]);

function onKey(event) {
	if (event.key === "Escape") {
		emit("close");
	}
}

onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => window.removeEventListener("keydown", onKey));
</script>

<template>
	<!-- The backdrop closes it; clicks inside must not bubble out to it. -->
	<div class="sheet" role="dialog" aria-modal="true" aria-label="Profile" @click="emit('close')">
		<div class="sheet__body card" @click.stop>
			<button class="sheet__close" title="Close" aria-label="Close" @click="emit('close')">✕</button>
			<UserProfile :id="id" :linkable="false" />
			<!-- Room moderation actions, when the opener has any to offer. -->
			<slot />
		</div>
	</div>
</template>

<style scoped>
.sheet {
	position: fixed;
	inset: 0;
	z-index: 20;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1.5rem;
	background: rgba(0, 0, 0, 0.5);
}

.sheet__body {
	position: relative;
	width: min(520px, 100%);
	max-height: 85vh;
	overflow-y: auto;
	padding: 1.5rem;
}

.sheet__close {
	position: absolute;
	top: 0.6rem;
	right: 0.6rem;
	border: 0;
	background: none;
	cursor: pointer;
	font-size: 1rem;
	color: var(--text-muted);
	line-height: 1;
	padding: 0.35rem;
	border-radius: var(--radius-sm);
}

.sheet__close:hover {
	color: var(--text);
	background: var(--surface-2);
}
</style>
