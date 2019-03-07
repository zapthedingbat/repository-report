const path = require("path");

module.exports = exports = function create(name) {
  const createVcs = require(path.join(__dirname, name));
  return createVcs();
}
