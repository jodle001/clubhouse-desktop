#!/usr/bin/env node
/**
 * Electron ships its ~220 MB binary via a post-install download. When that is
 * blocked - proxy, firewall, `ignore-scripts`, or ELECTRON_SKIP_BINARY_DOWNLOAD
 * - npm still reports a successful install, and the failure only surfaces much
 * later as "Error: Electron uninstall" from a tool that never explains it.
 *
 * Runs before `dev` and `start`: checks for the binary, and finishes the
 * install if it is missing.
 */

import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const electronDir = join(root, "node_modules", "electron");
const pathFile = join(electronDir, "path.txt");

function binaryPath() {
	if (!existsSync(pathFile)) {
		return null;
	}

	const relative = readFileSync(pathFile, "utf8").trim();
	const full = join(electronDir, "dist", relative);
	return existsSync(full) ? full : null;
}

if (!existsSync(electronDir)) {
	console.error("\nElectron is not installed. Run `npm install` first.\n");
	process.exit(1);
}

if (binaryPath()) {
	process.exit(0);
}

console.log("\nElectron's binary is missing - its post-install download did not complete.");

if (process.env.ELECTRON_SKIP_BINARY_DOWNLOAD) {
	console.error("ELECTRON_SKIP_BINARY_DOWNLOAD is set, which is why. Unset it and re-run.\n");
	process.exit(1);
}

console.log("Finishing the install now (~220 MB, one time)...\n");

const result = spawnSync(process.execPath, ["install.js"], {
	cwd: electronDir,
	stdio: "inherit"
});

if (result.status === 0 && binaryPath()) {
	console.log("\nElectron is ready.\n");
	process.exit(0);
}

console.error(
	"\nCould not download the Electron binary.\n\n" +
		"This is usually a proxy or firewall blocking github.com release downloads.\n" +
		"Options:\n" +
		"  • set a mirror:  export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/\n" +
		"  • or a proxy:    export HTTPS_PROXY=http://your-proxy:port\n" +
		"  • then re-run:   (cd node_modules/electron && node install.js)\n"
);
process.exit(1);
