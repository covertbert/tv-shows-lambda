module.exports = {
  '*.{ts,json,md,html,yml}': ['prettier --write'],
  '*.{ts}': ['eslint --fix'],
}
