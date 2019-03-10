module.exports = exports = function createReportRenderer(renderers) {
  return async function render(group, report, writer) {
    for (const rendererName in renderers) {
      const renderer = renderers[rendererName];
      await writer(group.name, renderer(group, report), rendererName);
    }
  }
}
