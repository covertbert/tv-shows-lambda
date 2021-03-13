module.exports = {
  '*.{ts,tsx,js,css,json,md,html,yml}': ['prettier --write'],
  '*.{ts,tsx}': ['eslint --fix'],
}
