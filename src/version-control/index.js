const path = require("path");

module.exports = exports = function create(name) {
  const vcs = require(path.join(__dirname, name));
  return vcs();
}
