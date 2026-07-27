<script setup>
defineProps({
	message: { type: String, default: "Nothing here yet." },
	icon: { type: String, default: "" }
});
</script>

<template>
	<p class="empty muted">
		<span v-if="icon" class="empty__icon">{{ icon }}</span>
		{{ message }}
	</p>
</template>

<style scoped>
.empty {
	text-align: center;
	padding: 2rem 1rem;
	font-size: 0.9rem;
}

.empty__icon {
	display: block;
	font-size: 1.8rem;
	margin-bottom: 0.4rem;
}
</style>
