<script setup>
/**
 * The room's poll: the question, its options as result bars, and a tap to
 * vote. Percentages and the total are the server's own (poll_results); the
 * option you chose is marked. A moderator with no poll running instead gets a
 * small form to start one, kept honest to the room's validation rules.
 */
import { computed, ref } from "vue";
import { useSharedRoom } from "../composables/useRoom.js";

const room = useSharedRoom();
const poll = room.poll;

/** Percent for one option, off poll_results, keyed by id. */
function percentFor(optionId) {
	const row = (poll.results?.poll_option_results || []).find(r => r.poll_option_id === optionId);
	return row?.percentage ?? 0;
}

const options = computed(() => poll.metadata?.poll_options || []);
const hasPoll = computed(() => Boolean(poll.metadata?.poll_id));

/** The palette from poll_colors, cycled if there are more options than colours. */
function colorFor(index) {
	const colors = poll.colors || [];
	if (!colors.length) {
		return "var(--accent)";
	}

	const c = colors[index % colors.length];
	// Each colour is { light_hex, dark_hex }; the bar is tinted, so one hex is
	// enough and the light one reads on both themes at low opacity.
	return c?.light_hex || c?.dark_hex || "var(--accent)";
}

function vote(optionId) {
	room.votePoll(optionId);
}

// --- moderator: starting a poll ---------------------------------------------

const composing = ref(false);
const title = ref("");
const draftOptions = ref(["", ""]);

function addOption() {
	if (draftOptions.value.length < 4) {
		draftOptions.value.push("");
	}
}

/**
 * Enough to send: a question and at least two options with something in them.
 * The room reports an option_characters_min of 5, but that is advisory - real
 * polls run "Yes"/"No" - so length is left to the server, which names anything
 * it dislikes in poll.error rather than a button that refuses without saying
 * why.
 */
const filledOptions = computed(() => draftOptions.value.filter(o => o.trim().length));
const canSubmit = computed(() => title.value.trim().length > 0 && filledOptions.value.length >= 2);

async function submit() {
	if (await room.createPoll(title.value, draftOptions.value)) {
		composing.value = false;
		title.value = "";
		draftOptions.value = ["", ""];
	}
}
</script>

<template>
	<section class="poll card">
		<!-- A live poll: question, bars, and the tally. -->
		<template v-if="hasPoll">
			<header class="poll__head">
				<span class="poll__eyebrow">📊 Poll</span>
				<h3 class="poll__title">{{ poll.metadata.poll_title }}</h3>
			</header>

			<ul class="poll__options">
				<li v-for="(option, i) in options" :key="option.poll_option_id">
					<button
						class="poll__option"
						:class="{ 'poll__option--mine': option.poll_option_id === poll.mySelectionId }"
						type="button"
						:disabled="poll.voting"
						@click="vote(option.poll_option_id)"
					>
						<span
							class="poll__bar"
							:style="{ width: percentFor(option.poll_option_id) + '%', background: colorFor(i) }"
						/>
						<span class="poll__label">
							<span class="poll__check">{{ option.poll_option_id === poll.mySelectionId ? "✓" : "" }}</span>
							{{ option.poll_option_title }}
						</span>
						<span class="poll__pct">{{ percentFor(option.poll_option_id) }}%</span>
					</button>
				</li>
			</ul>

			<footer class="poll__foot muted">
				{{ poll.results?.total_votes_text || "" }}
			</footer>
		</template>

		<!-- No poll: a moderator can start one. -->
		<template v-else-if="room.canManagePoll.value">
			<header class="poll__head">
				<span class="poll__eyebrow">📊 Poll</span>
			</header>

			<button v-if="!composing" class="btn btn-secondary btn-sm" @click="composing = true">
				＋ Start a poll
			</button>

			<form v-else class="poll__form" @submit.prevent="submit">
				<input
					v-model="title"
					class="poll__input"
					placeholder="Ask the room something…"
					aria-label="Poll question"
					maxlength="80"
				>
				<input
					v-for="(_, i) in draftOptions"
					:key="i"
					v-model="draftOptions[i]"
					class="poll__input"
					:placeholder="`Option ${i + 1}`"
					:aria-label="`Option ${i + 1}`"
					maxlength="30"
				>
				<div class="poll__form-actions">
					<button
						v-if="draftOptions.length < 4"
						class="btn btn-secondary btn-sm"
						type="button"
						@click="addOption"
					>
						＋ Option
					</button>
					<span v-if="!canSubmit" class="poll__hint muted">A question and two options.</span>
					<span class="grow" />
					<button class="btn btn-secondary btn-sm" type="button" @click="composing = false">Cancel</button>
					<button class="btn btn-sm" type="submit" :disabled="!canSubmit">Start</button>
				</div>
			</form>
		</template>

		<p v-if="poll.error" class="poll__error">{{ poll.error }}</p>
	</section>
</template>

<style scoped>
.poll {
	padding: 1rem 1.1rem;
	margin-bottom: 1.25rem;
}

.poll__head {
	margin-bottom: 0.75rem;
}

.poll__eyebrow {
	font-size: 0.7rem;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: var(--text-muted);
}

.poll__title {
	margin: 0.25rem 0 0;
	font-size: 1.02rem;
	line-height: 1.3;
}

.poll__options {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	gap: 0.5rem;
}

.poll__option {
	position: relative;
	display: flex;
	align-items: center;
	width: 100%;
	padding: 0.6rem 0.8rem;
	border: 1px solid var(--border);
	border-radius: var(--radius-sm);
	background: var(--surface-2);
	overflow: hidden;
	text-align: left;
	transition: border-color 0.12s ease;
}

.poll__option:hover:not(:disabled) {
	border-color: var(--accent);
}

.poll__option--mine {
	border-color: var(--accent);
}

/* The tinted fill sits behind the label and grows to the percentage. */
.poll__bar {
	position: absolute;
	inset: 0 auto 0 0;
	opacity: 0.22;
	transition: width 0.4s ease;
}

.poll__label {
	position: relative;
	flex: 1;
	min-width: 0;
	font-size: 0.9rem;
	font-weight: 600;
}

.poll__check {
	display: inline-block;
	width: 0.9rem;
	color: var(--accent);
}

.poll__pct {
	position: relative;
	font-size: 0.82rem;
	font-variant-numeric: tabular-nums;
	color: var(--text-muted);
}

.poll__foot {
	margin-top: 0.7rem;
	font-size: 0.78rem;
}

.poll__form {
	display: grid;
	gap: 0.5rem;
}

.poll__input {
	padding: 0.6rem 0.8rem;
	font-size: 0.9rem;
}

.poll__form-actions {
	display: flex;
	align-items: center;
	gap: 0.4rem;
}

.poll__hint {
	font-size: 0.76rem;
}

.poll__error {
	margin: 0.7rem 0 0;
	font-size: 0.8rem;
	color: var(--danger);
}
</style>
