const fs = require("fs");
const path = require("path");

module.exports = exports = function renderCssFiles() {
  const cssPath = path.join(__dirname, '../assets');
  return fs.readdirSync(cssPath)
    .filter(fileName => fileName.endsWith('.css'))
    .map(fileName => fs.readFileSync(path.join(cssPath, fileName), 'utf8'));
}
