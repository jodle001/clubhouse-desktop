<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApi } from "../composables/useApi.js";
import { useSession } from "../composables/useSession.js";
import { verificationCode } from "@shared/phone.js";
import AppSpinner from "../components/AppSpinner.vue";

const route = useRoute();
const router = useRouter();
const { signIn } = useSession();
const { loading, call } = useApi();

const phone = computed(() => route.query.phone || "");
const code = ref("");
const error = ref("");
const called = ref(false);

onMounted(() => {
	if (!phone.value) {
		router.replace({ name: "login" });
	}
});

async function verify() {
	// Clubhouse sends 6 digits. The old client hard-coded a check for exactly
	// 4 and silently did nothing for anything else. The guard lives in
	// shared/phone.js so the tests exercise this exact rule.
	const digits = verificationCode(code.value);

	if (!digits) {
		error.value = "Enter the code from the text message.";
		return;
	}

	error.value = "";
	loading.value = true;

	try {
		const result = await call("completePhoneAuth", phone.value, digits);

		if (!result.success) {
			error.value =
				result.error_message ||
				(result.number_of_attempts_remaining != null
					? `That code was not accepted. ${result.number_of_attempts_remaining} attempt(s) left.`
					: "Verification failed.");
			return;
		}

		await signIn(result);

		if (result.is_waitlisted || !result.is_verified) {
			router.replace({ name: "waitlist" });
		} else if (!result.user_profile?.username) {
			router.replace({ name: "editProfile" });
		} else {
			router.replace({ name: "home" });
		}
	} catch (err) {
		error.value = err.message;
	} finally {
		loading.value = false;
	}
}

async function callMe() {
	called.value = true;
	setTimeout(() => (called.value = false), 15000);

	try {
		const result = await call("callPhoneAuth", phone.value);
		if (!result.success) {
			error.value = result.error_message || "Could not place the call.";
		}
	} catch (err) {
		error.value = err.message;
	}
}
</script>

<template>
	<div class="center-screen">
		<AppSpinner v-if="loading" />

		<div v-else class="card verify">
			<div class="verify__logo" aria-hidden="true">👋</div>
			<h1>Enter your code</h1>
			<p class="muted verify__sub">Sent to {{ phone }}</p>

			<input
				v-model="code"
				type="tel"
				inputmode="numeric"
				autofocus
				placeholder="123456"
				aria-label="Verification code"
				class="verify__code"
				@keyup.enter="verify"
			>

			<p v-if="error" class="error-box">{{ error }}</p>

			<div class="verify__actions">
				<button class="btn" @click="verify">Verify code</button>
				<button v-if="!called" class="btn btn-secondary" @click="callMe">Call me instead</button>
				<span v-else class="muted">Calling…</span>
			</div>

			<RouterLink :to="{ name: 'login' }" class="muted verify__back">Wrong number?</RouterLink>
		</div>
	</div>
</template>

<style scoped>
.verify {
	width: min(420px, 100%);
	text-align: center;
}

.verify__logo {
	font-size: 2.6rem;
}

.verify h1 {
	margin: 0.4rem 0 0;
	font-size: 1.15rem;
}

.verify__sub {
	margin: 0.15rem 0 1.5rem;
	font-size: 0.85rem;
}

.verify__code {
	text-align: center;
	letter-spacing: 0.4em;
	font-size: 1.2rem;
}

.verify__actions {
	display: flex;
	justify-content: center;
	gap: 0.6rem;
	margin-top: 1.25rem;
}

.error-box {
	margin-top: 1rem;
}

.verify__back {
	display: block;
	margin-top: 1.25rem;
	font-size: 0.82rem;
}
</style>
