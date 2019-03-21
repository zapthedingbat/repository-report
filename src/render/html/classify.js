const logger = require('../../lib/logger');

module.exports = exports = function classify(classifications, auditResults) {
  const classificationCriteriaAuditResults = classifications.map(classification => {
    const criteriaAuditResults = {};
    classification.auditCriteria.forEach(auditCriterion => {
      criteriaAuditResults[auditCriterion] = auditResults[auditCriterion]
    });
    return {
      details: classification.details,
      auditResults: criteriaAuditResults
    }
  });

  // Get the first classificationCriteriaAuditResults where all the criteria are
  // met.

  const matchedClassificationCriteriaAuditResults = classificationCriteriaAuditResults.find(classificationCriteriaAuditResult => {
    return Object.values(classificationCriteriaAuditResult.auditResults).every(auditResult => auditResult.pass);
  });

  return {
    matched: matchedClassificationCriteriaAuditResults ? matchedClassificationCriteriaAuditResults.details : null,
    classifications: classificationCriteriaAuditResults
  }
}
