<script setup>
import { ref, onMounted } from "vue";
import { useSession, updateSettings } from "../composables/useSession.js";
import { useTheme } from "../composables/useTheme.js";
import { notify } from "../composables/useToast.js";

const { state } = useSession();
const { theme, setTheme, THEMES } = useTheme();

const audioEnabled = ref(false);
const filterNonLatinRooms = ref(false);

onMounted(() => {
	audioEnabled.value = Boolean(state.settings.audioEnabled);
	filterNonLatinRooms.value = Boolean(state.settings.filterNonLatinRooms);
});

async function toggleAudio() {
	await updateSettings({ audioEnabled: audioEnabled.value });
	notify({
		message: audioEnabled.value
			? "Audio enabled. Rejoin a room to connect."
			: "Audio disabled. Rooms will be silent."
	});
}

function toggleFilter() {
	updateSettings({ filterNonLatinRooms: filterNonLatinRooms.value });
}
</script>

<template>
	<div class="page">
		<h1 class="page__title">Settings</h1>

		<section class="card stack">
			<h2 class="section__title">Appearance</h2>
			<label class="field">
				<span>Theme</span>
				<select :value="theme" @change="setTheme($event.target.value)">
					<option v-for="t in THEMES" :key="t" :value="t">{{ t }}</option>
				</select>
			</label>
		</section>

		<section class="card stack">
			<h2 class="section__title">Audio</h2>
			<label class="check">
				<input v-model="audioEnabled" type="checkbox" @change="toggleAudio">
				<span>
					Enable room audio
					<small class="muted">
						Loads the Agora SDK and connects to room audio. Off by default — the rest of
						the app works either way.
					</small>
				</span>
			</label>
		</section>

		<section class="card stack">
			<h2 class="section__title">Rooms</h2>
			<label class="check">
				<input v-model="filterNonLatinRooms" type="checkbox" @change="toggleFilter">
				<span>
					Hide rooms with non-Latin titles
					<small class="muted">Filters topics written in CJK scripts.</small>
				</span>
			</label>
		</section>

		<p class="muted about">
			Clubhouse Desktop · unofficial client · originally by
			<a href="https://callmearta.ir" target="_blank" rel="noreferrer">Arta Mo</a>
		</p>
	</div>
</template>

<style scoped>
.page {
	padding: 1.25rem;
	max-width: 560px;
	margin: 0 auto;
	display: grid;
	gap: 1rem;
}

.page__title {
	font-size: 1.3rem;
	margin: 0;
}

.section__title {
	font-size: 0.78rem;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: var(--text-muted);
	margin: 0;
}

.field {
	display: grid;
	gap: 0.3rem;
	font-size: 0.9rem;
}

.check {
	display: flex;
	gap: 0.6rem;
	align-items: flex-start;
	font-size: 0.9rem;
}

.check input {
	width: auto;
	margin-top: 0.25rem;
}

.check small {
	display: block;
	font-size: 0.78rem;
	margin-top: 0.15rem;
}

.about {
	font-size: 0.78rem;
	text-align: center;
}

.about a {
	text-decoration: underline;
}
</style>
