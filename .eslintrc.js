module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['eslint-plugin-simple-import-sort'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    curly: ['error', 'all'],
  },

  overrides: [
    {
      files: [
        '__tests__/**/*.{ts,js}',
        '**/*.test.{ts,tsx}',
        './scripts/*.{js,ts,tsx}',
      ],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        isolatedModules: 'off',
      },
    },
  ],
};
