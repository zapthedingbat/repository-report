module.exports = exports = async function (gatherers) {
  const assets = {};
  for (const gathererName in gatherers) {
    const gatherer = gatherers[gathererName];
    assets[gathererName] = await gatherer();
  }
  return assets;
}
