const getGenerators = require("./generators");
const logger = require("../logger");

async function generateReports(appId, results) {
  const generators = getGenerators(appId);
  for (generate of generators) {
    try {
      await generate(results);
    } catch (err) {
      logger.error(err, "error generating report");
    }
  }
}

module.exports = generateReports;
