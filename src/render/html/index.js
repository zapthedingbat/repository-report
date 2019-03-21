const createIcons = require('./render/icons-svg');
const createRenderDocument = require('./render/document');
const createRenderGroup = require('./render/group');
const renderReport = require('./render/report');
const createCollect = require('./render/collect');
const minify = require('html-minifier').minify;

module.exports = exports = function html(group, { audits, results }, refDate) {
  const icons = createIcons();
  const renderGroup = createRenderGroup(renderReport, group);
  const collectRenderGroupIcons = createCollect(() => icons.render(), renderGroup);
  const renderDocument = createRenderDocument(collectRenderGroupIcons, group.name);
  const minifyOptions = {
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeAttributeQuotes: true,
    removeComments: true
  };
  
  return minify(renderDocument({ audits, results }, refDate), minifyOptions);
}
