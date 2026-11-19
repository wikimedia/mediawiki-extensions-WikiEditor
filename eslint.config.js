'use strict';

const { defineConfig, globalIgnores } = require( 'eslint/config' );
const wikimedia = require( 'eslint-config-wikimedia/flat' );

// Shared by modules and tests (was modules/.eslintrc.json)
const modulesConfig = [
	...wikimedia( 'client', 'jquery', 'mediawiki' ),
	{
		languageOptions: {
			// CommonJS globals (was `env: { commonjs: true }`)
			globals: {
				require: 'readonly',
				module: 'readonly',
				exports: 'writable',
				global: 'readonly'
			}
		},
		rules: {
			'max-len': 'off',
			'no-jquery/no-global-selector': 'off',
			'no-jquery/no-jquery-ui': 'warn'
		}
	}
];

// Directories with their own config, which other configs don't apply to.
// These were directories with `"root": true` in .eslintrc.json.
const rootDirs = {
	modules: [ 'modules/**' ],
	tests: [ 'tests/qunit/**' ]
};

module.exports = defineConfig( [
	globalIgnores( [
		// Build
		'docs/',
		'vendor/',

		// Language files written automatically by TranslateWiki
		'**/i18n/**/*.json',
		'!**/i18n/**/en.json',
		'!**/i18n/**/qqq.json'
	] ),

	// Gruntfile.js, etc.
	{
		ignores: Object.values( rootDirs ).flat(),
		extends: [ wikimedia( 'server' ) ]
	},

	// Code which runs in MediaWiki
	{
		files: rootDirs.modules,
		extends: modulesConfig
	},

	// QUnit tests
	{
		files: rootDirs.tests,
		extends: [ wikimedia( 'qunit' ), modulesConfig ]
	}
] );
