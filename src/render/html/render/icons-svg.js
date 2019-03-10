const icons = require("octicons");
const usages = new Set();

function def(name) {
  return `<g id="${name}">${icons[name].path}</g>`;
}

function createUse(usages) {
  return function use(name) {
    usages.add(name);
    const options = icons[name].options;
    return `<svg width="${options.width}" height="${options.height}" viewBox="${options.viewBox}"><use href="#${name}"/></svg>`
  }
}

function createRender(usages) {
  return function render() {
    return `
<svg>
  <defs>
    ${Array.from(usages).map(name => def(name)).join('')}
  </defs>
</svg>
    `
  }
}

module.exports = exports = function create() {
  return {
    use: createUse(usages),
    render: createRender(usages)
  }
}
