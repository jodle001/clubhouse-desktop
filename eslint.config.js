import js from "@eslint/js";
import vue from "eslint-plugin-vue";

export default [
	{ ignores: ["out/**", "dist/**", "node_modules/**", "resources/**"] },
	js.configs.recommended,
	...vue.configs["flat/recommended"],
	{
		languageOptions: {
			ecmaVersion: 2023,
			sourceType: "module",
			globals: {
				console: "readonly",
				process: "readonly",
				setTimeout: "readonly",
				clearTimeout: "readonly",
				setInterval: "readonly",
				clearInterval: "readonly",
				window: "readonly",
				document: "readonly",
				matchMedia: "readonly",
				globalThis: "readonly",
				URL: "readonly",
				URLSearchParams: "readonly",
				Uint8Array: "readonly",
				TextEncoder: "readonly",
				fetch: "readonly",
				AbortSignal: "readonly",
				HTMLInputElement: "readonly",
				KeyboardEvent: "readonly"
			}
		},
		rules: {
			"no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"vue/multi-word-component-names": "off",
			"vue/max-attributes-per-line": "off",
			"vue/singleline-html-element-content-newline": "off",
			"vue/html-indent": ["error", "tab"]
		}
	}
];
