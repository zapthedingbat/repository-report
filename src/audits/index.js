//const { nodeDependencies } = require('./node-dependencies/node-dependencies');
const logger = require("../logger");
const { hasReadme, readmeLength, readmeStructure } = require("./readme");
const { pushed } = require("../audits/activity");
const {
  hasCodeOfConduct,
  hasContributingFile,
  hasEditorConfigFile,
  hasLicenseFile,
  hasSupportFile
} = require("./files");

// TODO: Make list of audits configurable
async function runAllAudits(assets, context) {
  const audits = [
    pushed,
    hasReadme,
    readmeLength,
    readmeStructure,
    // hasCodeOfConduct,
    hasContributingFile
    // hasEditorConfigFile,
    // hasLicenseFile,
    // hasSupportFile
  ];

  const reports = [];
  for (audit of audits) {
    try {
      const result = await audit.audit(assets, context);
      const report = {
        name: audit.name,
        description: audit.description,
        result
      };
      reports.push(report);
    } catch (err) {
      logger.error(err, "Error executing audit");
    }
  }

  return reports;
}

module.exports = runAllAudits;
