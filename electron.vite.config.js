import { resolve } from "node:path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()],
		build: {
			rollupOptions: {
				input: { index: resolve("src/main/index.js") }
			}
		}
	},
	preload: {
		plugins: [externalizeDepsPlugin()],
		build: {
			rollupOptions: {
				input: { index: resolve("src/preload/index.js") },
				// CommonJS deliberately: Electron only loads ESM preload
				// scripts in unsandboxed renderers, and the sandbox is worth
				// more than the module syntax. See webPreferences in
				// src/main/index.js.
				output: { format: "cjs" }
			}
		}
	},
	renderer: {
		root: resolve("src/renderer"),
		resolve: {
			alias: {
				"@": resolve("src/renderer"),
				"@shared": resolve("src/shared")
			}
		},
		build: {
			rollupOptions: {
				input: { index: resolve("src/renderer/index.html") }
			}
		},
		plugins: [vue()]
	}
});
