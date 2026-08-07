<script setup>
import AppAvatar from "./AppAvatar.vue";

defineProps({
	user: { type: Object, required: true },
	speaking: { type: Boolean, default: false },
	/** A reaction floating over this person right now - { emoji, gif } - or null. */
	reaction: { type: Object, default: null }
});

// The room decides what opening a profile means - here it is a sheet, not a
// link, because navigating away would leave the channel.
const emit = defineEmits(["select"]);
</script>

<template>
	<button
		type="button"
		class="tile"
		:class="{ 'tile--speaking': speaking }"
		:title="user.name"
		@click="emit('select', user)"
	>
		<div class="tile__avatar">
			<AppAvatar :user="user" :size="76" />
			<span v-if="user.is_muted" class="tile__badge" title="Muted">🔇</span>
			<span v-else-if="user.hand_raised" class="tile__badge" title="Hand raised">✋</span>
			<Transition name="tile-react">
				<span
					v-if="reaction"
					:key="reaction.gif || reaction.emoji"
					class="tile__reaction"
					aria-hidden="true"
				>
					<img v-if="reaction.gif" :src="reaction.gif" alt="" class="tile__gif">
					<template v-else>{{ reaction.emoji }}</template>
				</span>
			</Transition>
		</div>
		<span class="tile__name truncate">
			<span v-if="user.is_moderator" title="Moderator">✳️</span>
			{{ user.first_name || user.name }}
		</span>
		<small class="muted truncate">@{{ user.username }}</small>
	</button>
</template>

<style scoped>
.tile {
	display: flex;
	border: 0;
	background: none;
	font: inherit;
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

.tile__reaction {
	position: absolute;
	left: 50%;
	top: -10px;
	transform: translateX(-50%);
	font-size: 1.4rem;
	filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.35));
	pointer-events: none;
}

.tile__gif {
	display: block;
	width: 58px;
	height: 58px;
	object-fit: cover;
	border-radius: var(--radius-sm);
}

.tile-react-enter-active {
	transition: transform 0.25s ease, opacity 0.25s ease;
}

.tile-react-leave-active {
	transition: transform 0.4s ease, opacity 0.4s ease;
}

.tile-react-enter-from {
	transform: translateX(-50%) translateY(8px) scale(0.6);
	opacity: 0;
}

.tile-react-leave-to {
	transform: translateX(-50%) translateY(-14px);
	opacity: 0;
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
