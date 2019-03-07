const logger = require('./lib/logger');

module.exports = exports = function create(gatherers) {
  return async function gather(repository) {
    const artefacts = {};
    for (const gathererName in gatherers) {
      const gatherer = gatherers[gathererName];
      const value = await gatherer(repository);
      artefacts[gathererName] = value;
      logger.debug({ gathererName, gathererValue: value }, 'Gather');
    }
    logger.debug(artefacts, 'Gathered artefacts');
    return artefacts;
  }
}
