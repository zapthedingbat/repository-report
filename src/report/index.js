const getGenerators = require('./generators');

async function generateReports(appId, owner, results) {
  const generators = getGenerators(appId, owner);
  for (generate of generators) {
    await generate(results);
  }
}

module.exports = generateReports
