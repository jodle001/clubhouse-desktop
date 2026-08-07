#!/usr/bin/env node
/**
 * The whole API surface, read out of the Android app.
 *
 *   npm run endpoints -- ~/Downloads/clubhouse.apk
 *
 * Clubhouse's app is built with Retrofit, so every endpoint it can call is a
 * plain string literal compiled into the APK's dex - "join_channel",
 * "send_channel_reaction", and every one we have not found yet, sitting right
 * there. This pulls those literals out and lists them, marking which the app
 * here already speaks and which are new. No decompiler and no network: an APK
 * is a zip, a dex is mostly text, and `unzip` is all it takes.
 *
 * Get the APK from a mirror you trust (APKMirror, APKPure) - the free,
 * universal build of com.clubhouse.app. An .xapk/.apkm bundle works too; it is
 * just a zip of split APKs and the base one is unpacked automatically.
 *
 * Reverse-engineering a client you use, against your own account, to talk to
 * the same service - this reads names, nothing more, and sends nothing.
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const apk = process.argv[2];
if (!apk || !existsSync(apk)) {
	console.error("\nUsage: npm run endpoints -- <path-to.apk|.xapk|.apkm>");
	console.error("Download the free build of com.clubhouse.app from a mirror first.\n");
	process.exit(1);
}

/** List entries in a zip. */
function entries(zip) {
	return execFileSync("unzip", ["-Z1", zip], { encoding: "utf8", maxBuffer: 1 << 28 })
		.split("\n")
		.map(s => s.trim())
		.filter(Boolean);
}

/** Raw bytes of one entry. */
function readEntry(zip, name) {
	return execFileSync("unzip", ["-p", zip, name], { maxBuffer: 1 << 30 });
}

// An .xapk/.apkm/.zip bundle wraps split APKs; the base one holds the code.
let sourceApk = apk;
if (/\.(xapk|apkm|zip)$/i.test(apk)) {
	const inner = entries(apk).filter(e => e.endsWith(".apk"));
	const base = inner.find(e => /(^|\/)base\.apk$/i.test(e)) || inner.find(e => !/split|config|arm|x86|dpi/i.test(e)) || inner[0];
	if (!base) {
		console.error("No .apk found inside the bundle.");
		process.exit(1);
	}

	const dir = mkdtempSync(join(tmpdir(), "chapk-"));
	sourceApk = join(dir, "base.apk");
	writeFileSync(sourceApk, readEntry(apk, base));
	console.log(`bundle → ${base}`);
}

const dexes = entries(sourceApk).filter(e => /^classes\d*\.dex$/.test(e));
if (!dexes.length) {
	console.error("No classes.dex in the APK - is this really an Android app?");
	process.exit(1);
}

/** Printable-ASCII runs of length >= 4, the way `strings` finds them. */
function asciiRuns(buf) {
	const out = [];
	let start = -1;
	for (let i = 0; i <= buf.length; i++) {
		const c = i < buf.length ? buf[i] : 0;
		const printable = c >= 0x20 && c <= 0x7e;
		if (printable && start === -1) {
			start = i;
		} else if (!printable && start !== -1) {
			if (i - start >= 4) {
				out.push(buf.toString("latin1", start, i));
			}
			start = -1;
		}
	}

	return out;
}

// The verbs Clubhouse's endpoints begin with, and the nouns they act on. A
// token that starts with a verb or names one of these domains, and reads like
// a route, is almost certainly an endpoint.
// Endpoints are verbs acting on a resource, so they begin with one. Anchoring
// on the verb prefix is what separates a route ("enable_channel_messages")
// from a field ("is_chat_enabled") or a resource id ("notification_bg").
const VERBS =
	/^(get|send|create|update|change|make|set|delete|remove|add|leave|join|start|complete|accept|reject|decline|invite|uninvite|block|unblock|follow|unfollow|vote|submit|end|mute|unmute|report|search|hide|unhide|pin|unpin|save|unsave|edit|enable|disable|approve|cancel|record|schedule|preview|expire|refresh|initiate|suspend|unsuspend|subscribe|unsubscribe|mark|ignore|check|rsvp|grant|reset|alias|resend|call)_[a-z0-9_]+$/;

// Families that are plainly not routes: instrumentation SDK resources, Android
// notification/drawable ids, and the like. Cheaper to name them than to guess
// every verb a field might accidentally start with.
const NOISE = /^(ib|ibc|ibg|ibg_|instabug|notification_(?!settings)|anr_|profile_(chunk|sample|lifecycle|id|release)|user_(attributes|events|steps|data|bundle|class|since|type|uuid|release))/;

const tokens = new Set();
for (const dex of dexes) {
	for (const run of asciiRuns(readEntry(sourceApk, dex))) {
		// Lowercase snake_case single segment, verb-led, not obvious noise.
		if (/^[a-z][a-z0-9_]{3,60}$/.test(run) && VERBS.test(run) && !NOISE.test(run)) {
			tokens.add(run);
		}
	}
}

// What the app here already calls, pulled straight from the source so the
// comparison never drifts.
const here = dirname(fileURLToPath(import.meta.url));
const endpointsSrc = readFileSync(join(here, "..", "src", "shared", "api", "endpoints.js"), "utf8");
const known = new Set([...endpointsSrc.matchAll(/["'`]\/([a-z0-9_]+)["'`]/g)].map(m => m[1]));

const found = [...tokens].sort();
const fresh = found.filter(t => !known.has(t));
const spoken = found.filter(t => known.has(t));

const report =
	`Endpoints found in ${apk}\n` +
	`dex files: ${dexes.join(", ")}\n\n` +
	`Already spoken by this app (${spoken.length}):\n` +
	spoken.map(t => `  ${t}`).join("\n") +
	`\n\nNew - not yet in endpoints.js (${fresh.length}):\n` +
	fresh.map(t => `  ${t}`).join("\n") +
	"\n";

const outFile = join(process.cwd(), "endpoints-found.txt");
writeFileSync(outFile, report);

console.log(`\n${spoken.length} known, ${fresh.length} new, ${found.length} total.`);
console.log(`Full list written to ${outFile}`);
console.log("\nNew endpoints (paste these back):\n");
console.log(fresh.map(t => `  ${t}`).join("\n") || "  (none - unusual; the dex may be packed)");
console.log("");
