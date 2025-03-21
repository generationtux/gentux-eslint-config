import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactPlugin from 'eslint-plugin-react';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    languageOptions: {
      globals: {
        console: true,
        document: true,
        module: true,
        navigator: true,
        process: true,
        require: true,
        window: true,
        // Jest globals - until `eslint-plugin-jest` supports eslint 9
        afterAll: true,
        afterEach: true,
        beforeAll: true,
        beforeEach: true,
        describe: true,
        expect: true,
        it: true,
        jest: true,
        test: true,
        vi: true, // for vitest compatibility
      },
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-use-before-define': 'error',
      'jsx-a11y/href-no-hash': 'off',
      'no-console': 'warn',
      'no-prototype-builtins': 'off',
      'no-useless-escape': 'off',
      'react/jsx-uses-react': 'off',
      'react/no-access-state-in-setstate': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-redundant-should-component-update': 'error',
      'react/no-typos': 'error',
      'react/no-unused-state': 'warn',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'coverage/**'],
  },
];
