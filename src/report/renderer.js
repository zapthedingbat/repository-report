module.exports = exports = function createReportRenderer(renderers) {
  return async function render(reportName, report, writer) {
    for (const rendererName in renderers) {
      const renderer = renderers[rendererName];
      await writer(reportName, renderer(report), rendererName);
    }
  }
}
