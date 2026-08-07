<script setup>
/**
 * Discover houses. get_discovery_feed returns collections - each a titled row
 * of houses (social clubs) - which is the nearest thing to a public directory
 * the API offers; the live-room hallway stays follow-driven, so this is where
 * you go looking beyond the people you already know.
 *
 * The club object inside a collection is read defensively: the feed nests it a
 * few ways and the account had a limited sample, so a club with no id simply
 * renders without a link rather than breaking the row.
 */
import { onMounted, ref } from "vue";
import { useApi } from "../composables/useApi.js";
import AppSpinner from "../components/AppSpinner.vue";
import EmptyState from "../components/EmptyState.vue";

const { run } = useApi();

const collections = ref([]);
const loading = ref(true);

/** A feed item wraps its collection under one of a couple of keys. */
function collectionOf(item) {
	return item.social_club_collection || item.collection || item;
}

/** A collection's clubs, however they are nested. */
function clubsOf(collection) {
	const raw = collection.items || collection.social_clubs || collection.clubs || [];
	// An item may be the club itself, or wrap it under social_club/club.
	return raw.map(entry => entry.social_club || entry.club || entry).filter(Boolean);
}

function clubId(club) {
	return club.social_club_id ?? club.club_id ?? club.id ?? null;
}

function clubName(club) {
	return club.name || club.title || club.social_club_name || "House";
}

function clubMembers(club) {
	return club.num_members ?? club.members_count ?? club.num_followers ?? null;
}

function clubPhoto(club) {
	return club.photo_url || club.image_url || club.icon_url || null;
}

async function load() {
	loading.value = true;
	const result = await run("getDiscoveryFeed");
	collections.value = (result?.items || [])
		.map(collectionOf)
		.map(collection => ({ title: collection.title || "Houses", clubs: clubsOf(collection) }))
		.filter(collection => collection.clubs.length);
	loading.value = false;
}

onMounted(load);
</script>

<template>
	<div class="page">
		<h1 class="page__title">Discover</h1>
		<p class="muted page__sub">Houses to explore beyond the people you follow.</p>

		<AppSpinner v-if="loading" />
		<EmptyState v-else-if="!collections.length" icon="🧭" message="Nothing to discover right now." />

		<section v-for="(collection, i) in collections" v-else :key="i" class="collection">
			<h2 class="collection__title">{{ collection.title }}</h2>
			<div class="collection__row">
				<component
					:is="clubId(club) ? 'RouterLink' : 'div'"
					v-for="(club, j) in collection.clubs"
					:key="clubId(club) ?? j"
					:to="clubId(club) ? { name: 'club', params: { id: clubId(club) } } : undefined"
					class="house"
				>
					<span class="house__badge">
						<img v-if="clubPhoto(club)" :src="clubPhoto(club)" alt="" loading="lazy">
						<span v-else aria-hidden="true">🏠</span>
					</span>
					<span class="house__name truncate">{{ clubName(club) }}</span>
					<span v-if="clubMembers(club) != null" class="house__meta muted">
						{{ clubMembers(club) }} members
					</span>
				</component>
			</div>
		</section>
	</div>
</template>

<style scoped>
.page {
	padding: 1.25rem;
	max-width: 900px;
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

.collection {
	margin-bottom: 1.75rem;
}

.collection__title {
	font-size: 0.95rem;
	margin: 0 0 0.75rem;
}

.collection__row {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	gap: 0.75rem;
}

.house {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.4rem;
	padding: 1rem 0.75rem;
	background: var(--surface);
	border-radius: var(--radius);
	box-shadow: var(--shadow-sm);
	text-align: center;
	transition: transform 0.12s ease, box-shadow 0.12s ease;
}

a.house:hover {
	transform: translateY(-2px);
	box-shadow: var(--shadow);
}

.house__badge {
	width: 56px;
	height: 56px;
	border-radius: 18px;
	overflow: hidden;
	background: var(--surface-2);
	display: grid;
	place-items: center;
	font-size: 1.5rem;
}

.house__badge img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.house__name {
	font-weight: 600;
	font-size: 0.85rem;
	max-width: 100%;
}

.house__meta {
	font-size: 0.72rem;
}
</style>
