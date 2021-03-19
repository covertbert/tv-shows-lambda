module.exports = {
  hooks: {
    'pre-commit': 'yarn lambda:build && lint-staged',
    'post-merge': 'yarn',
  },
}
