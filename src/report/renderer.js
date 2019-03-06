module.exports = exports = function createReportRenderer(renderers) {
  return async function render(report, writer) {
    for (const rendererName in renderers) {
      const renderer = renderers[rendererName];
      await writer(renderer(report), rendererName);
    }
  }
}
