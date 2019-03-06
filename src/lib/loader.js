const path = require("path");

module.exports = exports = function load(directory, list) {
  const modules = {};
  list.split(',')
    .filter(name => name !== '')
    .forEach(name => modules[name] = require(path.join(__dirname, directory, name)));
  return modules;
}
