import { createRouter, createWebHashHistory } from "vue-router";
import { sessionState } from "./composables/useSession.js";

const routes = [
	{ path: "/", name: "login", component: () => import("./views/LoginView.vue"), meta: { public: true } },
	{ path: "/verify", name: "verify", component: () => import("./views/VerifyView.vue"), meta: { public: true }, props: true },
	{ path: "/waitlist", name: "waitlist", component: () => import("./views/WaitlistView.vue") },
	{ path: "/home", name: "home", component: () => import("./views/HomeView.vue") },
	{ path: "/room/:channel", name: "room", component: () => import("./views/RoomView.vue"), props: true },
	{ path: "/me", name: "me", component: () => import("./views/ProfileView.vue"), props: () => ({ id: "me" }) },
	{ path: "/user/:id", name: "user", component: () => import("./views/ProfileView.vue"), props: true },
	{ path: "/search/:query", name: "search", component: () => import("./views/SearchView.vue"), props: true },
	{ path: "/profile/edit", name: "editProfile", component: () => import("./views/EditProfileView.vue") },
	{ path: "/club/:id", name: "club", component: () => import("./views/ClubView.vue"), props: true },
	{ path: "/settings", name: "settings", component: () => import("./views/SettingsView.vue") },
	{ path: "/:pathMatch(.*)*", redirect: { name: "home" } }
];

export const router = createRouter({
	history: createWebHashHistory(),
	routes
});

/**
 * One guard, in one place. The old app scattered this across every view's
 * beforeRouteEnter, several of which called next() twice.
 */
router.beforeEach(to => {
	if (!sessionState.ready) {
		return true;
	}

	const isPublic = to.meta.public === true;

	if (!sessionState.signedIn) {
		return isPublic ? true : { name: "login" };
	}

	const user = sessionState.user || {};
	const waitlisted = user.is_waitlisted || !user.is_verified;

	if (waitlisted && to.name !== "waitlist") {
		return { name: "waitlist" };
	}

	if (!waitlisted && isPublic) {
		return { name: "home" };
	}

	return true;
});
