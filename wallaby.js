module.exports = function (wallaby) {
  return {
    files: [
      { pattern: '.keys/**/*' },
      { pattern: 'src/**/*.js' },
      { pattern: 'src/**/*.spec.js', ignore: true }
    ],
    tests: [
      'src/**/*.spec.js'
    ],
    env: {
      type: 'node'
    },
  }
}
