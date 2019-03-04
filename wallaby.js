module.exports = function(wallaby) {
  return {
    files: [{ pattern: ".keys/**/*" }, { pattern: "src/**/*.js" }],
    tests: ["test/**/*.spec.js"],
    env: {
      type: "node"
    }
  };
};
