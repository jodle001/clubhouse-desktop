#!/usr/bin/env node
/**
 * Reads an endpoint's exact request contract out of the Android app.
 *
 *   npm run decompile -- ~/Downloads/clubhouse.apk send_wave
 *   npm run decompile -- ~/Downloads/clubhouse.apk            # defaults to send_wave
 *
 * The endpoint-name extractor (npm run endpoints) reads route strings; this
 * goes a step further and decompiles with jadx to show the *method* behind a
 * route - its Retrofit annotations and parameters, and the fields of whatever
 * request type it takes. That is the definitive answer to "what does this
 * endpoint want", with no probing.
 *
 * jadx (~150MB) is fetched on first run and cached under .jadx/; the decompiled
 * output is cached under .jadx-out/ so a second endpoint lookup is instant.
 * Both are gitignored. A full decompile of the app takes a few minutes.
 *
 * Reverse-engineering a client you use, against your own account - it reads
 * code, runs nothing, sends nothing.
 */

import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const apk = process.argv[2];
const endpoint = process.argv[3] || "send_wave";

if (!apk || !existsSync(apk)) {
	console.error("\nUsage: npm run decompile -- <path-to.apk|.apkm|.xapk> [endpoint]");
	console.error("Download the free build of com.clubhouse.app from a mirror first.\n");
	process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const jadxDir = join(root, ".jadx");
const jadxBin = join(jadxDir, "bin", "jadx");
const outDir = join(root, ".jadx-out");

function sh(cmd, args, opts = {}) {
	return execFileSync(cmd, args, { encoding: "utf8", maxBuffer: 1 << 30, ...opts });
}

// --- resolve the base APK from a file, a bundle, or an unpacked directory ---
let sourceApk = apk;
const isDir = statSync(apk).isDirectory();

if (isDir) {
	// An unpacked bundle: a folder of split APKs. base.apk carries the code.
	const apks = readdirSync(apk).filter(f => f.endsWith(".apk"));
	const base =
		apks.find(f => /^base\.apk$/i.test(f)) ||
		apks.find(f => !/split|config|arm|x86|dpi/i.test(f)) ||
		apks.sort((a, b) => statSync(join(apk, b)).size - statSync(join(apk, a)).size)[0];
	if (!base) {
		console.error(`No .apk inside ${apk}. Contents: ${readdirSync(apk).join(", ")}`);
		process.exit(1);
	}
	sourceApk = join(apk, base);
	console.log(`directory → ${base}`);
} else if (/\.(xapk|apkm|zip)$/i.test(apk)) {
	const list = sh("unzip", ["-Z1", apk]).split("\n").map(s => s.trim()).filter(Boolean);
	const base =
		list.find(e => /(^|\/)base\.apk$/i.test(e)) || list.find(e => e.endsWith(".apk") && !/split|config/i.test(e));
	if (!base) {
		console.error("No base .apk inside the bundle.");
		process.exit(1);
	}

	mkdirSync(outDir, { recursive: true });
	sourceApk = join(outDir, "base.apk");
	if (!existsSync(sourceApk)) {
		writeFileSync(sourceApk, execFileSync("unzip", ["-p", apk, base], { maxBuffer: 1 << 30 }));
	}
	console.log(`bundle → ${base}`);
}

// --- ensure jadx -----------------------------------------------------------
if (!existsSync(jadxBin)) {
	console.log("Fetching jadx (~150MB, one time)…");
	const zip = join(root, "jadx.zip");
	sh("curl", ["-sSL", "-o", zip, "https://github.com/skylot/jadx/releases/download/v1.5.0/jadx-1.5.0.zip"]);
	mkdirSync(jadxDir, { recursive: true });
	sh("unzip", ["-o", "-q", zip, "-d", jadxDir]);
	sh("rm", ["-f", zip]);
	sh("chmod", ["+x", jadxBin]);
}

// --- decompile once, cache -------------------------------------------------
const srcDir = join(outDir, "sources");
if (!existsSync(srcDir)) {
	console.log("Decompiling (a few minutes)…");
	// --no-res: skip resources, much faster. --show-bad-code: keep going past
	// classes jadx cannot fully resolve. -j: parallel.
	try {
		execSync(`"${jadxBin}" --no-res --show-bad-code -j 4 -d "${outDir}" "${sourceApk}"`, {
			stdio: "ignore",
			maxBuffer: 1 << 30
		});
	} catch {
		// jadx exits non-zero when some classes fail; the output is still usable.
	}
}

if (!existsSync(srcDir)) {
	console.error("Decompile produced no sources - jadx may have failed. Try again, or check disk space.");
	process.exit(1);
}

// --- find the endpoint's method --------------------------------------------
function grepFiles(pattern) {
	try {
		return sh("grep", ["-rl", pattern, srcDir]).split("\n").filter(Boolean);
	} catch {
		return [];
	}
}

console.log(`\nLooking for "${endpoint}"…\n`);
const files = grepFiles(`"${endpoint}"`);
if (!files.length) {
	console.error(`No "${endpoint}" literal found. Try the endpoint-name list: npm run endpoints -- ${apk}`);
	process.exit(1);
}

const TYPE = /\b([A-Z][A-Za-z0-9_]+(?:Request|Response|Body|Params|Payload))\b/g;
const referencedTypes = new Set();

for (const file of files) {
	const lines = readFileSync(file, "utf8").split("\n");
	lines.forEach((line, i) => {
		if (line.includes(`"${endpoint}"`)) {
			// Print the annotation and the method it decorates: a window that
			// captures @FormUrlEncoded above and the parameter list below.
			const from = Math.max(0, i - 3);
			const to = Math.min(lines.length, i + 8);
			console.log(`— ${file.replace(srcDir + "/", "")}:${i + 1}`);
			for (let j = from; j < to; j++) {
				console.log(`  ${lines[j]}`);
				for (const m of lines[j].matchAll(TYPE)) {
					referencedTypes.add(m[1]);
				}
			}
			console.log("");
		}
	});
}

// --- print the fields of any request/response type it uses -----------------
for (const type of referencedTypes) {
	const typeFiles = grepFiles(`class ${type} `).concat(grepFiles(`class ${type}(`));
	for (const file of [...new Set(typeFiles)]) {
		const body = readFileSync(file, "utf8");
		if (!new RegExp(`class ${type}\\b`).test(body)) {
			continue;
		}

		console.log(`— fields of ${type} (${file.replace(srcDir + "/", "")}):`);
		for (const line of body.split("\n")) {
			// The serialized name is the wire field; catch Gson and Moshi both,
			// plus plain field declarations as a fallback.
			if (/@(SerializedName|Json)\s*\(|@Json\(name|private\s+\w|public\s+\w/.test(line) && !/void|class |return/.test(line)) {
				console.log(`    ${line.trim()}`);
			}
		}
		console.log("");
	}
}

// tiny helper so the cache dir is discoverable if something looks stale
const size = (() => {
	try {
		return readdirSync(srcDir).length;
	} catch {
		return 0;
	}
})();
console.log(`(decompiled sources cached in ${srcDir}, ${size} top-level packages — delete .jadx-out to redo)`);
