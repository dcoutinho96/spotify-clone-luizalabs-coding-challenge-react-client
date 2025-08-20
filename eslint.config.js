// eslint.config.ts
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores([
    'dist',
    'src/gql/generated.ts',
    'coverage'
  ]),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },

  {
    files: [
      'eslint.config.{js,cjs,mjs,ts}',
      'vite.config.{js,cjs,mjs,ts}',
      'codegen.{js,cjs,mjs,ts}',
      'scripts/**/*.{js,ts}',
    ],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      // no React rules needed in Node context
    },
  },
])
