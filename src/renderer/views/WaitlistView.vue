<script setup>
import { useRouter } from "vue-router";
import { useSession } from "../composables/useSession.js";

const router = useRouter();
const { signOut } = useSession();

async function logout() {
	await signOut();
	router.push({ name: "login" });
}
</script>

<template>
	<div class="center-screen">
		<div class="card waitlist">
			<div class="waitlist__logo" aria-hidden="true">👋</div>
			<h1>You're on the waitlist</h1>
			<p class="muted">
				Ask a friend already on Clubhouse to let you in. If someone has just invited you,
				log out and back in to pick it up.
			</p>
			<button class="btn" @click="logout">Log out</button>
		</div>
	</div>
</template>

<style scoped>
.waitlist {
	width: min(420px, 100%);
	text-align: center;
}
.waitlist__logo { font-size: 2.6rem; }
.waitlist h1 { margin: 0.4rem 0 0.75rem; font-size: 1.15rem; }
.waitlist p { font-size: 0.88rem; margin-bottom: 1.5rem; }
</style>
