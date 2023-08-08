/* eslint-disable filenames-simple/naming-convention */
module.exports = {
	root: true,
	extends: ["with-tsconfig", "plugin:filenames-simple/recommended-react"],
	plugins: ["filenames-simple"],
	rules: {
		semi: ["error", "always"],
		"no-console": [
			"warn",
			{
				allow: ["info", "warn", "error"],
			},
		],
		"no-await-in-loop": "off",
		"padding-line-between-statements": "warn",
		"class-methods-use-this": "off",
		"@typescript-eslint/no-redeclare": "off",
		"@typescript-eslint/no-floating-promises": "off",
		"@typescript-eslint/no-confusing-void-expression": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"security/detect-object-injection": "off",
	},
	overrides: [
		{
			files: ["vite.config.ts", ".eslintrc.cjs"],
			parserOptions: {
				project: "./tsconfig.node.json",
			},
		},
	],
	ignorePatterns: ["node_modules/", "dist/", "docs/"],
};
