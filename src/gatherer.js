module.exports = exports = function create(gatherers) {
  return async function gather(repository) {
    const assets = {};
    for (const gathererName in gatherers) {
      const gatherer = gatherers[gathererName];
      assets[gathererName] = await gatherer(repository);
    }
    return assets;
  }
}
