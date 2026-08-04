#!/usr/bin/env node
/**
 * Builds, then runs the app, forwarding any arguments to Electron itself:
 *
 *   npm start -- --verbose
 *
 * `electron-vite preview` parses its own flags and rejects anything it does not
 * recognise, so a bare `--verbose` is a hard error. Everything after a trailing
 * `--` is forwarded to Electron instead, which is the supported escape hatch.
 *
 * Setting ELECTRON_CLI_ARGS ourselves does not work, even though that is the
 * variable electron-vite uses internally: its CLI does
 * `if (options['--']) process.env.ELECTRON_CLI_ARGS = ...`, and cac always
 * supplies `options['--']` as an array, so an empty one silently overwrites
 * whatever we set.
 *
 * `out/` is gitignored, so a fresh clone has nothing to preview - hence the
 * build step first.
 */

import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const isWindows = process.platform === "win32";
const bin = join(root, "node_modules", ".bin", isWindows ? "electron-vite.cmd" : "electron-vite");
const appArgs = process.argv.slice(2);

const options = { stdio: "inherit", cwd: root, shell: isWindows };

const build = spawnSync(bin, ["build"], options);
if (build.status !== 0) {
	process.exit(build.status ?? 1);
}

const previewArgs = ["preview", "--skipBuild"];
if (appArgs.length > 0) {
	previewArgs.push("--", ...appArgs);
}

const run = spawnSync(bin, previewArgs, options);

// status is null when the child died by signal (a SIGSEGV in Electron, say);
// `?? 0` reported that as success to anything scripting around us.
if (run.signal) {
	console.error(`electron-vite was killed by ${run.signal}`);
	process.exit(1);
}

process.exit(run.status ?? 1);
