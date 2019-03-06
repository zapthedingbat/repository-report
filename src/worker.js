module.exports = exports = async function worker(repositories, gather, auditor, generateReport) {
  const repositoryResults = [];
  for (let repository of repositories) {
    const artefacts = await gather(repository);
    const auditResults = await auditor.getAuditResults(artefacts);
    repositoryResults.push({
      artefacts,
      results: auditResults
    })
  }
  await generateReport(repositoryResults, auditor.details);
}
