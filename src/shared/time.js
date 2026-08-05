/**
 * Short, human relative time - "3m", "5h", "2d" - the way a chat list writes
 * it. Kept here, dependency-free, so it is tested without a component.
 */

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

export function relativeTime(iso, now = Date.now()) {
	const then = Date.parse(iso);
	if (!Number.isFinite(then)) {
		return "";
	}

	const seconds = Math.max(0, Math.round((now - then) / 1000));

	if (seconds < MINUTE) {
		return "just now";
	}
	if (seconds < HOUR) {
		return `${Math.floor(seconds / MINUTE)}m`;
	}
	if (seconds < DAY) {
		return `${Math.floor(seconds / HOUR)}h`;
	}
	if (seconds < WEEK) {
		return `${Math.floor(seconds / DAY)}d`;
	}
	if (seconds < MONTH) {
		return `${Math.floor(seconds / WEEK)}w`;
	}
	if (seconds < YEAR) {
		return `${Math.floor(seconds / MONTH)}mo`;
	}

	return `${Math.floor(seconds / YEAR)}y`;
}
