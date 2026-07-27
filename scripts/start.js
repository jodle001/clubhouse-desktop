#!/usr/bin/env node
/**
 * Builds, then runs the app, forwarding any arguments to Electron itself:
 *
 *   npm start -- --verbose
 *
 * `electron-vite preview` parses its own flags and rejects anything it does not
 * recognise, so a bare `--verbose` is a hard error. Its own escape hatch is a
 * trailing `--`, which it forwards via the ELECTRON_CLI_ARGS environment
 * variable. Setting that variable here does the same thing without a cryptic
 * dangling `--` in package.json that somebody would eventually tidy away.
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

const run = spawnSync(bin, ["preview", "--skipBuild"], {
	...options,
	env: { ...process.env, ELECTRON_CLI_ARGS: JSON.stringify(appArgs) }
});

process.exit(run.status ?? 0);
