import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import { globalIgnores } from 'eslint/config'

const disallowCommentsRule = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow comments (except allowlist)' },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const sourceCode = context.getSourceCode()
    const options = context.options[0] || {}
    const allow = options.allow || []
    return {
      Program() {
        for (const comment of sourceCode.getAllComments()) {
          const re = allow.length ? new RegExp(`^\\s?(${allow.join('|')})`) : null
          if (!re || !re.test(comment.value)) {
            context.report({
              loc: comment.loc,
              message: 'Comments are forbidden',
              fix(fixer) {
                return fixer.remove(comment)
              },
            })
          }
        }
      },
    }
  },
}

export default tseslint.config([
  globalIgnores(['dist', 'coverage', 'src/gql/generated.ts']),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      custom: {
        rules: { 'disallow-comments': disallowCommentsRule },
      },
    },
    rules: {
      'custom/disallow-comments': ['error', { allow: ['TODO', 'FIXME'] }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },

  {
    files: ['**/*.test.{ts,tsx}', '**/test/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  {
    files: ['**/vite-env.d.ts', '**/*.d.ts'],
    rules: {
      'custom/disallow-comments': 'off',
    },
  },
])