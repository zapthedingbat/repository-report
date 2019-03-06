const path = require("path");
const writeFiles = require("./write-files");

const html = require("./html");
const json = require("./json");

module.exports = exports = function getGenerators() {
  const generators = [];

  //const jsonWriter = writeFiles(path.join(__dirname, '../../.reports'), 'json');
  //generators.push(json(jsonWriter, appId, owner));

  const htmlWriter = writeFiles(path.join(__dirname, "../../.reports"), "html");
  generators.push(html(htmlWriter));

  return generators;
};
