//const { nodeDependencies } = require('./node-dependencies/node-dependencies');

const { hasReadme, readmeLength, readmeStructure } = require('./readme');

// TODO: Make list of audits configurable
async function runAllAudits(assets, context) {
  const audits = [
    hasReadme,
    readmeLength,
    readmeStructure
  ];

  const reports = [];
  for (audit of audits) {
    try {
      const result = await audit.audit(assets, context);
      const report = {
        name: audit.name,
        description: audit.description,
        result,
      }
      reports.push(report);
    } catch (err) {
      console.error(err);
    }
  }

  return reports;
}

module.exports = runAllAudits;
