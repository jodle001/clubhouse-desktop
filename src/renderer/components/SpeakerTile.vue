<script setup>
import AppAvatar from "./AppAvatar.vue";

defineProps({
	user: { type: Object, required: true },
	speaking: { type: Boolean, default: false }
});
</script>

<template>
	<RouterLink
		:to="{ name: 'user', params: { id: user.user_id } }"
		class="tile"
		:class="{ 'tile--speaking': speaking }"
		:title="user.name"
	>
		<div class="tile__avatar">
			<AppAvatar :user="user" :size="76" />
			<span v-if="user.is_muted" class="tile__badge" title="Muted">🔇</span>
			<span v-else-if="user.hand_raised" class="tile__badge" title="Hand raised">✋</span>
		</div>
		<span class="tile__name truncate">
			<span v-if="user.is_moderator" title="Moderator">✳️</span>
			{{ user.first_name || user.name }}
		</span>
		<small class="muted truncate">@{{ user.username }}</small>
	</RouterLink>
</template>

<style scoped>
.tile {
	display: flex;
	color: inherit;
	cursor: pointer;
	border-radius: var(--radius-sm);
	padding: 0.35rem;
	transition: background 0.12s ease;
	flex-direction: column;
	align-items: center;
	gap: 0.2rem;
	width: 96px;
	text-align: center;
}

.tile__avatar {
	position: relative;
	border-radius: 50%;
	padding: 3px;
	border: 3px solid transparent;
	transition: border-color 0.15s ease;
}

.tile:hover {
	background: var(--surface-2);
}

.tile--speaking .tile__avatar {
	border-color: var(--green);
}

.tile__badge {
	position: absolute;
	right: 0;
	bottom: 2px;
	background: var(--surface);
	border-radius: 50%;
	font-size: 0.8rem;
	width: 22px;
	height: 22px;
	display: grid;
	place-items: center;
	box-shadow: var(--shadow);
}

.tile__name {
	font-size: 0.82rem;
	font-weight: 600;
	max-width: 100%;
}

.tile small {
	font-size: 0.72rem;
	max-width: 100%;
}
</style>
