import js from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
  {
    ignores: ['coverage/', 'node_modules/', '.svelte-kit/', 'build/'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],
  prettierRecommended,
  ...svelte.configs['flat/prettier'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: ['.svelte'],
      },
    },
  },
  {
    rules: {
      'prettier/prettier': 'error',
      eqeqeq: 'error',
      'no-var': 'error',
      // `let` is required when destructuring $props() with $bindable()
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-param-reassign': 'error',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      // Svelte trims leading/trailing whitespace inside elements, so `{' CP'}` is needed to keep it
      'svelte/no-useless-mustaches': 'off',
    },
  },
);
