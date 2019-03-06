module.exports = function(wallaby) {
  return {
    files: [
      { pattern: ".keys/**/*" },
      { pattern: "src/**/*.js" },
      { pattern: "test/**/*.snapshot", binary: true },
      { pattern: "test-support/**/*.js", instrument: false },
    ],
    tests: ["test/**/*.spec.js"],
    env: {
      type: "node"
    }
  };
};
