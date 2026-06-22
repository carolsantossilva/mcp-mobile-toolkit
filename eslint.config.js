import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: ["coverage/**", "dist/**", "node_modules/**"],
	},
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		files: ["**/*.ts"],
		languageOptions: {
			parserOptions: {
				project: ["./tsconfig.eslint.json"],
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			"@typescript-eslint/consistent-type-exports": "error",
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					fixStyle: "inline-type-imports",
					prefer: "type-imports",
				},
			],
			"@typescript-eslint/explicit-function-return-type": [
				"error",
				{
					allowExpressions: true,
				},
			],
			"@typescript-eslint/no-confusing-void-expression": [
				"error",
				{
					ignoreArrowShorthand: true,
				},
			],
		},
	},
);
