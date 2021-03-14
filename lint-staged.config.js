module.exports = {
  '*.{ts,json,md,html,yml}': ['prettier --write'],
  '*.{ts}': ['eslint --fix'],
  '**/*.ts?(x)': () => ['tsc -p tsconfig.json --noEmit', 'jest'],
}
