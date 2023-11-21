module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['next/core-web-vitals'],
	plugins: ['simple-import-sort', 'unused-imports'],
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			rules: {
				'no-unused-vars': 'warn',
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
