const getGenerators = require("./generators");
const logger = require("../logger");

async function generateReports(data) {
  const generators = getGenerators();
  for (generate of generators) {
    try {
      await generate(data);
    } catch (err) {
      logger.error(err, "error generating report");
    }
  }
}

module.exports = generateReports;
