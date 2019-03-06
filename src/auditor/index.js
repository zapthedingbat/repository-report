
function createGetAuditResults(audits) {
  return async function getAuditResults(artefacts) {
    const auditResults = {};
    for (const auditName in audits) {
      const audit = audits[auditName];
      const result = await audit.getResults(artefacts);
      auditResults[auditName] = result;
    }
    return auditResults;
  }
}

function createAuditDetails(audits) {
  return Object.values(audits).map(audit => audit.details);
}

module.exports = exports = function create(/* configuration */) { 
  // TODO: Pick audits based on configuration

  const audits = {
    one: {
      details: { },
      getResults: async () => '1'
    },
    two: {
      details: { },
      getResults: async () => '2'
    }
  }

  return {
    getAuditResults: createGetAuditResults(audits),
    details: createAuditDetails(audits)
  }
}
