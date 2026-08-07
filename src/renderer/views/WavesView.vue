<script setup>
/**
 * Waves: people who pinged you to hang out, and the ones you sent. The wave
 * object's shape is known only from the endpoint names (the account had none
 * to observe), so the author and ids are read defensively across the plausible
 * fields, and a wave that carries neither still renders as a plain row.
 */
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "../composables/useApi.js";
import AppAvatar from "../components/AppAvatar.vue";
import AppSpinner from "../components/AppSpinner.vue";
import EmptyState from "../components/EmptyState.vue";

const { run } = useApi();
const router = useRouter();

const received = ref([]);
const initiated = ref([]);
const loading = ref(true);
const busy = ref({});

/** The person on a wave, whichever field carries them. */
function waver(wave) {
	return wave.user_profile || wave.from_user_profile || wave.sender_user_profile || { name: "Someone" };
}

function waveId(wave) {
	return wave.wave_id ?? wave.id ?? null;
}

async function load() {
	loading.value = true;
	const [r, i] = await Promise.all([run("getReceivedWaves"), run("getInitiatedWaves")]);
	received.value = r?.waves || [];
	initiated.value = i?.waves || [];
	loading.value = false;
}

async function accept(wave) {
	const person = waver(wave);
	const key = waveId(wave) ?? person.user_id;
	busy.value = { ...busy.value, [key]: true };

	// accept_wave returns a room to join together; go straight into it when it
	// does. source is WAVE - we are answering from the waves inbox.
	const result = await run("acceptWave", { userId: person.user_id, waveId: waveId(wave), source: "WAVE" });
	if (result) {
		received.value = received.value.filter(w => w !== wave);
		const channel = result.channel || result.channel_id;
		if (channel) {
			router.push({ name: "room", params: { channel: result.channel || String(result.channel_id) } });
		}
	}

	const next = { ...busy.value };
	delete next[key];
	busy.value = next;
}

onMounted(load);
</script>

<template>
	<div class="page">
		<h1 class="page__title">👋 Waves</h1>
		<p class="muted page__sub">A wave is a nudge to jump into a room together.</p>

		<AppSpinner v-if="loading" />

		<template v-else>
			<section>
				<h2 class="waves__heading">Received</h2>
				<EmptyState v-if="!received.length" message="No waves waiting." />
				<ul v-else class="waves">
					<li v-for="(wave, i) in received" :key="waveId(wave) ?? i" class="wave">
						<AppAvatar :user="waver(wave)" :size="40" />
						<span class="wave__name">{{ waver(wave).name }}</span>
						<button
							class="btn btn-sm"
							:disabled="busy[waveId(wave) ?? waver(wave).user_id]"
							@click="accept(wave)"
						>
							Wave back
						</button>
					</li>
				</ul>
			</section>

			<section v-if="initiated.length">
				<h2 class="waves__heading">Sent</h2>
				<ul class="waves">
					<li v-for="(wave, i) in initiated" :key="waveId(wave) ?? i" class="wave">
						<AppAvatar :user="waver(wave)" :size="40" />
						<span class="wave__name">{{ waver(wave).name }}</span>
						<span class="muted wave__sent">Waved</span>
					</li>
				</ul>
			</section>
		</template>
	</div>
</template>

<style scoped>
.page {
	padding: 1.25rem;
	max-width: 640px;
	margin: 0 auto;
}

.page__title {
	font-size: 1.3rem;
	margin: 0;
}

.page__sub {
	font-size: 0.85rem;
	margin: 0.35rem 0 1.5rem;
}

.waves__heading {
	font-size: 0.78rem;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: var(--text-muted);
	margin: 1.25rem 0 0.6rem;
}

.waves {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	gap: 0.3rem;
}

.wave {
	display: flex;
	align-items: center;
	gap: 0.7rem;
	padding: 0.6rem 0.85rem;
	background: var(--surface);
	border-radius: var(--radius-sm);
	box-shadow: var(--shadow-sm);
}

.wave__name {
	flex: 1;
	font-weight: 600;
	font-size: 0.9rem;
}

.wave__sent {
	font-size: 0.8rem;
}
</style>
