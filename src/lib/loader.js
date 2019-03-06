const path = require("path");

module.exports = exports = function loader(root) {
  return function load(directory, list) {
    const modules = {};
    list.split(',')
      .filter(name => name !== '')
      .forEach(name => modules[name] = require(path.resolve(root, directory, name)));
    return modules;
  }
}
