<script setup>
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useRoom } from "../composables/useRoom.js";
import { useSession } from "../composables/useSession.js";
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
</script>

<template>
	<div class="room">
		<AppSpinner v-if="room.joining.value" />

		<template v-else-if="room.channel.info">
			<header class="room__header">
				<div class="grow">
					<h1 class="room__topic">{{ room.channel.info.topic || "Untitled room" }}</h1>
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
		</template>

		<EmptyState v-else-if="room.error.value" :message="room.error.value" />
	</div>
</template>

<style scoped>
.room {
	padding: 1.25rem;
	max-width: 1000px;
	margin: 0 auto;
	padding-bottom: 6rem;
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
}
</style>
