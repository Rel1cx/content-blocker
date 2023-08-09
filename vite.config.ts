/* eslint-disable @typescript-eslint/no-unused-vars */
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import monkey, { cdn } from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		monkey({
			entry: "src/main.ts",
			userscript: {
				name: "bilibili-filter",
				namespace: "me.relicx.bilibili-filter",
				description: "BiliBili 过滤器",
				author: "Rel1cx",
				match: ["https://*.bilibili.com/*"],
				"run-at": "document-body",
				icon: "https://www.bilibili.com/favicon.ico",
				source: "",
				supportURL: "",
				updateURL: "",
				downloadURL: "",
			},
			build: {
				// externalGlobals: {},
			},
		}),
		visualizer(),
	],
	build: {
		target: ["chrome113", "safari14"],
		minify: "terser",
		terserOptions: {
			ecma: 2020,
			compress: {
				passes: 2,
			},
		},
		rollupOptions: {
			output: {
				compact: true,
				generatedCode: "es2015",
			},
		},
	},
});
