<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import COUNTRIES, { DEFAULT_COUNTRY, findCountry } from "@shared/countries.js";
import { composePhone, phoneError } from "@shared/phone.js";
import { useApi } from "../composables/useApi.js";
import { useSession, updateSettings } from "../composables/useSession.js";
import AppSpinner from "../components/AppSpinner.vue";

const router = useRouter();
const { state } = useSession();
const { loading, call } = useApi();

const local = ref("");
const country = ref(state.settings.country || DEFAULT_COUNTRY);
const error = ref("");

const selected = computed(() => findCountry(country.value));
const preview = computed(() => composePhone(selected.value, local.value));

onMounted(() => {
	if (state.settings.country) {
		country.value = state.settings.country;
	}
});

function onCountryChange() {
	updateSettings({ country: country.value });
}

async function submit() {
	const phone = composePhone(selected.value, local.value);
	const problem = phoneError(phone, selected.value);

	if (problem) {
		error.value = problem;
		return;
	}

	error.value = "";
	loading.value = true;

	try {
		const result = await call("startPhoneAuth", phone);
		if (result.success) {
			router.push({ name: "verify", query: { phone } });
			return;
		}

		error.value = result.error_message || "Clubhouse rejected the request.";
	} catch (err) {
		error.value = err.message;
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<div class="center-screen">
		<AppSpinner v-if="loading" />

		<div v-else class="card login">
			<div class="login__logo" aria-hidden="true">👋</div>
			<h1>Clubhouse</h1>
			<p class="muted login__sub">Unofficial desktop client</p>

			<div class="stack">
				<select v-model="country" aria-label="Country" @change="onCountryChange">
					<option v-for="c in COUNTRIES" :key="c.iso" :value="c.iso">
						{{ c.name }} (+{{ c.dial }})
					</option>
				</select>
				<input
					v-model="local"
					type="tel"
					autofocus
					placeholder="555 123 4567"
					aria-label="Phone number"
					@keyup.enter="submit"
				>
			</div>

			<p class="login__preview muted">
				<template v-if="preview">Will be sent as {{ preview }}</template>
				<template v-else>Enter your number the way you normally write it</template>
			</p>

			<button class="btn login__submit" @click="submit">Next</button>

			<p v-if="error" class="error-box">{{ error }}</p>
		</div>
	</div>
</template>

<style scoped>
.login {
	width: min(420px, 100%);
	text-align: center;
}

.login__logo {
	font-size: 2.6rem;
}

.login h1 {
	margin: 0.4rem 0 0;
	font-size: 1.15rem;
}

.login__sub {
	margin: 0.15rem 0 1.75rem;
	font-size: 0.85rem;
}

.login__preview {
	font-size: 0.8rem;
	margin: 0.6rem 0 0;
	min-height: 1.2em;
}

.login__submit {
	margin-top: 1.25rem;
}

.error-box {
	margin-top: 1.25rem;
}
</style>
