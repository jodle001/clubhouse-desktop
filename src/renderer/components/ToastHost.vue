<script setup>
import { useToast } from "../composables/useToast.js";

const { toasts, dismiss } = useToast();
</script>

<template>
	<div class="toasts" aria-live="polite">
		<div v-for="t in toasts.items" :key="t.id" class="toast" :class="`toast--${t.type}`" @click="dismiss(t.id)">
			<strong v-if="t.title">{{ t.title }}</strong>
			<span>{{ t.message }}</span>
			<span v-if="t.repeats > 1" class="toast__count">×{{ t.repeats }}</span>
		</div>
	</div>
</template>

<style scoped>
.toasts {
	position: fixed;
	right: 1rem;
	bottom: 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	z-index: 100;
	max-width: 360px;
}

.toast {
	padding: 0.75rem 1rem;
	border-radius: var(--radius);
	background: var(--surface);
	box-shadow: var(--shadow);
	border-left: 4px solid var(--accent);
	cursor: pointer;
}

.toast strong {
	display: block;
	font-size: 0.85rem;
}

.toast__count {
	display: inline-block;
	margin-left: 0.4rem;
	opacity: 0.7;
	font-variant-numeric: tabular-nums;
}

.toast--error {
	border-left-color: var(--danger);
	color: var(--danger);
}

.toast--success {
	border-left-color: var(--green);
}
</style>
