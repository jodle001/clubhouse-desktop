<script setup>
/**
 * A moderator's room settings, over the room rather than instead of it - the
 * same sheet pattern as a profile, so opening it never leaves the channel.
 * Every control is gated on the capability the room granted, and each change
 * is its own call: the sheet reflects channel.info, which the composable
 * patches the moment a call succeeds.
 */
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useSharedRoom } from "../composables/useRoom.js";

const room = useSharedRoom();
const emit = defineEmits(["close"]);

const caps = room.capabilities;
const settings = room.roomSettings;

// A local draft for the title, since it is a text field rather than a toggle.
const title = ref(settings.value.title);
watch(settings, s => (title.value = s.title));

async function saveTitle() {
	const wanted = title.value.trim();
	if (wanted && wanted !== settings.value.title) {
		await room.renameRoom(wanted);
	} else {
		title.value = settings.value.title;
	}
}

const chatOn = computed(() => settings.value.isChatEnabled);
const handraiseOn = computed(() => settings.value.handraiseQueueSetting > 0);

function onKey(event) {
	if (event.key === "Escape") {
		emit("close");
	}
}

onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => window.removeEventListener("keydown", onKey));
</script>

<template>
	<div class="sheet" role="dialog" aria-modal="true" aria-label="Room settings" @click="emit('close')">
		<div class="sheet__body card" @click.stop>
			<button class="sheet__close" title="Close" aria-label="Close" @click="emit('close')">✕</button>

			<h2 class="rs__title">Room settings</h2>

			<!-- Rename -->
			<label v-if="caps.can_edit_room_title" class="rs__field">
				<span class="rs__label">Room title</span>
				<input v-model="title" class="rs__input" maxlength="80" @blur="saveTitle" @keyup.enter="saveTitle">
			</label>

			<!-- Chat on/off + who -->
			<div v-if="caps.can_disable_room_chat" class="rs__field">
				<label class="rs__row">
					<span class="rs__label">Chat</span>
					<button
						class="rs__switch"
						:class="{ 'rs__switch--on': chatOn }"
						role="switch"
						:aria-checked="chatOn"
						type="button"
						@click="room.setRoomChat(!chatOn)"
					>
						<span class="rs__knob" />
					</button>
				</label>

				<select
					v-if="chatOn && settings.chatPermissionOptions.length"
					class="rs__select"
					:value="settings.chatPermission"
					aria-label="Who can chat"
					@change="room.changeChatPermission(Number($event.target.value))"
				>
					<option v-for="opt in settings.chatPermissionOptions" :key="opt.value" :value="opt.value">
						{{ opt.label }} can chat
					</option>
				</select>
			</div>

			<!-- Hand raising -->
			<label v-if="caps.can_edit_handraise_queue" class="rs__row">
				<span class="rs__label">Allow hand raising</span>
				<button
					class="rs__switch"
					:class="{ 'rs__switch--on': handraiseOn }"
					role="switch"
					:aria-checked="handraiseOn"
					type="button"
					@click="room.changeHandraise(handraiseOn ? 0 : 1)"
				>
					<span class="rs__knob" />
				</button>
			</label>

			<p v-if="room.roomSettingsError.value" class="rs__error">{{ room.roomSettingsError.value }}</p>
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
	width: min(440px, 100%);
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

.rs__title {
	margin: 0 0 1.25rem;
	font-size: 1.15rem;
}

.rs__field {
	margin-bottom: 1.1rem;
}

.rs__row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 1.1rem;
}

.rs__label {
	font-size: 0.9rem;
	font-weight: 600;
}

.rs__field .rs__label {
	display: block;
	margin-bottom: 0.4rem;
}

.rs__input,
.rs__select {
	padding: 0.6rem 0.8rem;
	font-size: 0.9rem;
}

.rs__select {
	margin-top: 0.6rem;
}

/* A pill switch, themed like the rest. */
.rs__switch {
	flex: 0 0 auto;
	width: 44px;
	height: 26px;
	border-radius: 999px;
	border: 0;
	background: var(--border);
	position: relative;
	cursor: pointer;
	transition: background 0.15s ease;
}

.rs__switch--on {
	background: var(--green);
}

.rs__knob {
	position: absolute;
	top: 3px;
	left: 3px;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background: #fff;
	transition: transform 0.15s ease;
}

.rs__switch--on .rs__knob {
	transform: translateX(18px);
}

.rs__error {
	margin: 0.5rem 0 0;
	font-size: 0.8rem;
	color: var(--danger);
}
</style>
