/* eslint-disable no-undef */
/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  files: ['*.js', '*.json', 'lambda/**/*.ts'],
  mutate: ['lambda/**/*.ts', '!**/*.test.ts', '!lambda/constants/**/*.ts'],
  testRunner: 'jest',
  coverageAnalysis: 'off',
  packageManager: 'yarn',
  reporters: ['html', 'clear-text', 'progress'],
  htmlReporter: { baseDir: 'build/reports/stryker' },
  tsconfigFile: 'tsconfig.json',
  timeoutMS: 60000,
  thresholds: { high: 100, low: 99.5, break: 99 },
  disableTypeChecks: 'lambda/**/*.ts',
}
