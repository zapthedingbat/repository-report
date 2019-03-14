module.exports = function(wallaby) {
  return {
    files: [
      { pattern: ".keys/**/*" },
      { pattern: "src/**/*.js" },
      { pattern: "src/**/*.css", binary: true },
      { pattern: "test/**/*.snapshot", binary: true },
      { pattern: "test-support/**/*.js", instrument: false },
    ],
    tests: ["test/**/*.spec.js"],
    env: {
      type: "node"
    }
  };
};
