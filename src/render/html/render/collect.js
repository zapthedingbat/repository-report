module.exports = exports =  function createCollect(collectFn, renderFn) {
  return function renderCollected(...args) {
    const rendered = renderFn(...args);
    const collected = collectFn();
    return `${collected}${rendered}`;
  }
}
