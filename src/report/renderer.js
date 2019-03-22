module.exports = exports = function createReportRenderer(renderers) {
  return async function render(group, report, writer) {
    const refDate = new Date();
    for (const rendererName in renderers) {
      const renderer = renderers[rendererName];
      await writer(group.name, renderer(group, report, refDate), rendererName);
    }
  }
}
