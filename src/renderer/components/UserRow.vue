<script setup>
import AppAvatar from "./AppAvatar.vue";

defineProps({
	user: { type: Object, required: true },
	subtitle: { type: String, default: "" },
	/** A link out is wrong inside a sheet that is already over something. */
	linkable: { type: Boolean, default: true }
});
</script>

<template>
	<component
		:is="linkable ? 'RouterLink' : 'div'"
		:to="linkable ? { name: 'user', params: { id: user.user_id } } : undefined"
		class="user-row"
	>
		<AppAvatar :user="user" :size="40" />
		<span class="grow">
			<span class="user-row__name truncate">{{ user.name }}</span>
			<small class="muted truncate">{{ subtitle || (user.username ? `@${user.username}` : "") }}</small>
		</span>
		<slot />
	</component>
</template>

<style scoped>
.user-row {
	display: flex;
	align-items: center;
	gap: 0.7rem;
	padding: 0.5rem;
	border-radius: var(--radius-sm);
}

.user-row:hover {
	background: var(--surface-2);
}

.user-row__name {
	display: block;
	font-weight: 600;
	font-size: 0.9rem;
}

.user-row small {
	display: block;
	font-size: 0.78rem;
}
</style>
