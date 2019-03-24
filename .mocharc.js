'use strict'

const isCi = process.env.CI === 'true';
const reporter = isCi ? "mocha-junit-reporter" : "spec"
const reporterOption = isCi ? [
  'mochaFile=./.output/test-results/results.xml',
] : [];

module.exports = {
  recursive: true,
  spec: "test/**/*.spec.js",
  reporterOption,
  reporter
}
