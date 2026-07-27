<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useRoom } from "../composables/useRoom.js";
import { useSession, updateSettings } from "../composables/useSession.js";
import SpeakerTile from "../components/SpeakerTile.vue";
import AppSpinner from "../components/AppSpinner.vue";
import EmptyState from "../components/EmptyState.vue";

const props = defineProps({ channel: { type: String, required: true } });

const router = useRouter();
const { state } = useSession();
const room = useRoom();

onMounted(async () => {
	const ok = await room.join(props.channel, {
		userId: state.user?.user_profile?.user_id,
		audioEnabled: state.settings.audioEnabled
	});

	if (!ok) {
		router.replace({ name: "home" });
	}
});

onUnmounted(() => room.leave());

async function exit() {
	await room.leave();
	router.push({ name: "home" });
}

const draft = ref("");
const sending = ref(false);
const log = ref(null);

// Remembered across rooms and restarts, so the layout you chose is the one you
// come back to.
const chatOpen = ref(state.settings.chatOpen !== false);

function toggleChat() {
	chatOpen.value = !chatOpen.value;
	updateSettings({ chatOpen: chatOpen.value });
}

/**
 * Follow the conversation, but only when already at the bottom - yanking the
 * view down while somebody is reading back is worse than missing a line.
 */
watch(
	() => room.chat.messages.length,
	async () => {
		const box = log.value;
		if (!box) {
			return;
		}

		const atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 60;
		await nextTick();

		if (atBottom) {
			box.scrollTop = box.scrollHeight;
		}
	}
);

async function send() {
	sending.value = true;

	// Only clear the box if it actually went, so a failure does not lose what
	// was typed.
	if (await room.sendChat(draft.value)) {
		draft.value = "";
	}

	sending.value = false;
}
</script>

<template>
	<div class="room" :class="{ 'room--chat-open': chatOpen && room.chat.enabled }">
		<AppSpinner v-if="room.joining.value" />

		<template v-else-if="room.channel.info">
			<div class="room__main">
				<header class="room__header">
					<div class="grow">
						<h1 class="room__topic">{{ room.channel.info.topic || "Untitled room" }}</h1>
						<p v-if="room.everCount.value" class="muted room__ever">
							{{ room.everCount.value }} have dropped in since it opened
						</p>
						<p v-if="!state.settings.audioEnabled" class="muted room__silent">
							Audio is off — enable it in Settings to hear the room.
						</p>
					</div>
					<button class="btn btn-danger" @click="exit">Leave quietly ✌️</button>
				</header>

				<section>
					<h2 class="room__heading">Speakers</h2>
					<div class="room__tiles">
						<SpeakerTile
							v-for="user in room.speakers.value"
							:key="user.user_id"
							:user="user"
							:speaking="room.speakingUids.value.has(user.user_id)"
						/>
					</div>
				</section>

				<section v-if="room.audience.value.length">
					<h2 class="room__heading">Also here ({{ room.audience.value.length }})</h2>
					<div class="room__tiles">
						<SpeakerTile v-for="user in room.audience.value" :key="user.user_id" :user="user" />
					</div>
				</section>

				<footer class="room__bar">
					<button
						class="btn btn-secondary"
						:disabled="!state.settings.audioEnabled"
						:title="state.settings.audioEnabled ? '' : 'Audio is disabled in Settings'"
						@click="room.toggleMute()"
					>
						{{ room.muted.value ? "🔇 Muted" : "🎙️ Live" }}
					</button>
					<button class="btn btn-secondary" @click="room.toggleHand()">
						{{ room.handRaised.value ? "✋ Hand raised" : "✋ Raise hand" }}
					</button>
				</footer>
			</div>

			<aside v-if="room.chat.enabled" class="room__aside" :class="{ 'room__aside--closed': !chatOpen }">
				<button
					class="room__tab"
					:aria-expanded="chatOpen"
					:title="chatOpen ? 'Hide chat' : 'Show chat'"
					@click="toggleChat"
				>
					{{ chatOpen ? "›" : "‹" }}
					<span class="room__tab-label">Chat</span>
				</button>

				<div v-show="chatOpen" class="room__panel">
					<h2 class="room__heading">Chat</h2>

					<p v-if="room.chat.error" class="room__chat-error">{{ room.chat.error }}</p>

					<EmptyState v-else-if="!room.chat.messages.length" message="No messages yet." />

					<ul v-else ref="log" class="room__messages">
						<li v-for="(message, i) in room.chat.messages" :key="message.message_id ?? i">
							<strong>{{ message.user_profile?.name || message.name || "Someone" }}</strong>
							<span>{{ message.message ?? message.text }}</span>
						</li>
					</ul>

					<form v-if="room.chat.canPost" class="room__compose" @submit.prevent="send">
						<input
							v-model="draft"
							placeholder="Say something"
							aria-label="Chat message"
							maxlength="500"
						>
						<button class="btn" type="submit" :disabled="!draft.trim() || sending">Send</button>
					</form>
				</div>
			</aside>
		</template>

		<EmptyState v-else-if="room.error.value" :message="room.error.value" />
	</div>
</template>

<style scoped>
/*
 * Two columns: the room, and the chat as a panel down the right. Collapsing it
 * leaves only the tab, so the room takes the full width and there is always
 * something to click to get chat back.
 */
.room {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	gap: 1rem;
	align-items: start;
	padding: 1.25rem;
	max-width: 1400px;
	margin: 0 auto;
	padding-bottom: 6rem;
}

.room__main {
	min-width: 0;
	max-width: 1000px;
}

.room__header {
	display: flex;
	align-items: flex-start;
	gap: 1rem;
	margin-bottom: 1.5rem;
}

.room__topic {
	margin: 0;
	font-size: 1.35rem;
}

.room__ever,
.room__silent {
	margin: 0.3rem 0 0;
	font-size: 0.8rem;
}

.room__heading {
	font-size: 0.78rem;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: var(--text-muted);
	margin: 1.25rem 0 0.75rem;
}

.room__heading:first-child {
	margin-top: 0;
}

.room__tiles {
	display: flex;
	flex-wrap: wrap;
	gap: 1.1rem;
}

.room__bar {
	position: fixed;
	left: 50%;
	bottom: 1.25rem;
	transform: translateX(-50%);
	display: flex;
	gap: 0.6rem;
	padding: 0.6rem;
	background: var(--surface);
	border-radius: 999px;
	box-shadow: var(--shadow);
	z-index: 2;
}

/* --- chat panel ---------------------------------------------------- */

.room__aside {
	position: sticky;
	top: 1.25rem;
	display: flex;
	align-items: stretch;
	gap: 0.5rem;
	height: calc(100vh - 8rem);
}

.room__tab {
	flex: 0 0 auto;
	width: 1.9rem;
	padding: 0.75rem 0;
	border: 0;
	cursor: pointer;
	background: var(--surface-2);
	color: var(--text-muted);
	border-radius: var(--radius-sm);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.95rem;
	line-height: 1;
}

.room__tab:hover {
	color: var(--text);
}

.room__tab-label {
	writing-mode: vertical-rl;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	font-size: 0.66rem;
}

.room__panel {
	display: flex;
	flex-direction: column;
	width: 300px;
	height: 100%;
	padding: 0.9rem;
	background: var(--surface);
	border-radius: var(--radius-sm);
	box-shadow: var(--shadow);
}

.room__chat-error {
	font-size: 0.8rem;
	color: var(--danger);
	margin: 0 0 0.5rem;
}

.room__messages {
	list-style: none;
	flex: 1;
	margin: 0 0 0.75rem;
	padding: 0.5rem 0.6rem;
	display: flex;
	flex-direction: column;
	gap: 0.45rem;
	overflow-y: auto;
	overflow-wrap: anywhere;
	background: var(--surface-2);
	border-radius: var(--radius-sm);
	font-size: 0.85rem;
}

.room__messages strong {
	margin-right: 0.4rem;
}

.room__compose {
	display: flex;
	gap: 0.5rem;
}

.room__compose input {
	flex: 1;
	min-width: 0;
}

/* Narrow windows: the panel would crowd the room, so it goes full width. */
@media (max-width: 900px) {
	.room {
		grid-template-columns: minmax(0, 1fr);
	}

	.room__aside {
		position: static;
		height: auto;
	}

	.room__panel {
		width: 100%;
	}

	.room__messages {
		max-height: 260px;
	}
}
</style>
