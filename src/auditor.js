
function createGetAuditResults(audits) {
  return function getAuditResults(artefacts) {
    const auditResults = {};
    for (const auditName in audits) {
      const audit = audits[auditName];
      const result = audit.getResults(artefacts);
      auditResults[auditName] = result;
    }
    return auditResults;
  }
}

function createAuditDetails(audits) {
  const auditDetails = {};
  for (const auditName in audits) {
    auditDetails[auditName] = audits[auditName].details;
  }
  return auditDetails;
}

module.exports = exports = function create(audits) {
  return {
    getAuditResults: createGetAuditResults(audits),
    details: createAuditDetails(audits)
  }
}
