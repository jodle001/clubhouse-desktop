<script setup>
import { computed } from "vue";

const props = defineProps({
	user: { type: Object, default: () => ({}) },
	size: { type: Number, default: 48 }
});

const initials = computed(() => {
	const name = props.user?.name || props.user?.username || "?";
	return name
		.split(/\s+/)
		.slice(0, 2)
		.map(part => part[0])
		.join("")
		.toUpperCase();
});

const style = computed(() => ({
	width: `${props.size}px`,
	height: `${props.size}px`,
	fontSize: `${Math.max(11, props.size / 2.8)}px`
}));
</script>

<template>
	<img v-if="user?.photo_url" :src="user.photo_url" :alt="user.name || ''" class="avatar" :style="style">
	<span v-else class="avatar avatar--fallback" :style="style" aria-hidden="true">{{ initials }}</span>
</template>

<style scoped>
.avatar {
	border-radius: 50%;
	object-fit: cover;
	flex-shrink: 0;
	background: var(--surface-2);
}

.avatar--fallback {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	color: var(--text-muted);
}
</style>
