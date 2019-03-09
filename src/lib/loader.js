const fs = require("fs");
const path = require("path");

module.exports = exports = function loader(root) {
  return function load(directory, list) {
    const moduleDirectory = path.resolve(root, directory);
    let moduleNames;
    if (list === "*") {
      moduleNames = fs.readdirSync(moduleDirectory);
    } else {
      moduleNames = list.split(',').filter(name => name !== '');
    }
    const modules = {};
    moduleNames.forEach(name => {
      const _module = require(path.join(moduleDirectory, name));
      const moduleName = name.replace(/\.js$/, '');
      modules[moduleName] = _module;
    });
    return modules;
  }
}
