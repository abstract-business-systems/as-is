// Workspace ESLint v9 flat config for JS/TS services
// Ported style rules without React/babel-eslint plugins

export default [
	{
		files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
		rules: {
			"no-console": "warn",
			"no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"eqeqeq": ["error", "always"],
			"indent": ["error", "tab", { SwitchCase: 1 }],
			"quotes": ["error", "single", { avoidEscape: true }],
			"semi": ["error", "always"],
			"comma-dangle": ["error", "always-multiline"],
			"no-trailing-spaces": "error",
			"no-multiple-empty-lines": ["error", { max: 1 }],
			"eol-last": ["error", "always"],
			"max-len": ["warn", { code: 80, ignoreUrls: true }],
			"no-var": "error",
			"prefer-const": "error",
			"arrow-body-style": ["error", "as-needed"],
			"arrow-parens": ["error", "always"],
			"func-style": ["error", "expression"],
			"prefer-arrow-callback": "error",
			"object-shorthand": ["error", "always"],
			"space-before-function-paren": ["error", "never"],
			"space-infix-ops": "error",
			"keyword-spacing": ["error", { before: true, after: true }],
			"object-curly-spacing": ["error", "always"],
			"array-bracket-spacing": ["error", "never"],
			"space-in-parens": ["error", "never"],
		},
	},
];
