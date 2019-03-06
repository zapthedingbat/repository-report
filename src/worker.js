module.exports = exports = async function worker(repositories, gather, auditor, generateReport) {
  const repositoryResults = [];
  for (let repository of repositories) {
    const artifacts = await gather(repository);
    const auditResults = await auditor.audit(artifacts);
    repositoryResults.push({
      artifacts,
      results: auditResults
    })
  }
  await generateReport(repositoryResults, auditor.auditDetails);
}
