import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

const alias = {
	"@": resolve("src/renderer"),
	"@shared": resolve("src/shared")
};

export default defineConfig({
	test: {
		projects: [
			{
				plugins: [vue()],
				resolve: { alias },
				test: {
					name: "shared",
					environment: "node",
					include: ["tests/shared/**/*.test.js"]
				}
			},
			{
				plugins: [vue()],
				resolve: { alias },
				test: {
					name: "renderer",
					environment: "jsdom",
					include: ["tests/renderer/**/*.test.js"],
					setupFiles: ["tests/setup.js"]
				}
			}
		]
	}
});
