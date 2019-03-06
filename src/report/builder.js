module.exports = exports = async function worker(repositories, gather, auditor) {
  const repositoriesResults = [];
  for (let repository of repositories) {
    const artefacts = await gather(repository);
    const auditResults = await auditor.getAuditResults(artefacts);
    repositoriesResults.push({
      artefacts,
      results: auditResults
    })
  }
  return {
    audits: auditor.details,
    results: repositoriesResults
  };
}
