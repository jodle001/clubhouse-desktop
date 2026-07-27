<script setup>
import UserProfile from "../components/UserProfile.vue";

defineProps({ id: { type: [String, Number], required: true } });
</script>

<template>
	<div class="page card">
		<UserProfile :id="id" />
	</div>
</template>

<style scoped>
.page {
	padding: 1.25rem;
	max-width: 520px;
	margin: 1.25rem auto;
}
</style>
