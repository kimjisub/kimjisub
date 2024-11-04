module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	plugins: ['@typescript-eslint', 'simple-import-sort', 'unused-imports'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'next/core-web-vitals',
	],
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			rules: {
				'no-unused-vars': 'warn',
				'unused-imports/no-unused-imports': 'warn',
				'simple-import-sort/imports': [
					'warn',
					{
						groups: [
							// Packages. `react` related packages come first.
							['^react', '^@?\\w'],
							// Side effect imports.
							['^\\u0000'],
							// Internal packages.
							['^()(/.*|$)'],
							// Parent imports. Put `..` last.
							['^\\.\\.(?!/?$)', '^\\.\\./?$'],
							// Other relative imports. Put same-folder imports and `.` last.
							['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
						],
					},
				],
			},
		},
	],
};
