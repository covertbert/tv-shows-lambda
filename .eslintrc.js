module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'no-console': 1,
    'prefer-template': 1,
    '@typescript-eslint/no-non-null-assertion': 0,
    'jest/no-try-expect': 0,
    'jest/no-conditional-expect': 0,
  },
  settings: {},
}
