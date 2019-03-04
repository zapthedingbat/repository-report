const github = require("./github");
const auditRepository = require("./repository");
const logger = require("./logger");

async function auditInstallation(installation, token) {
  const installationToken = await github.post(
    token,
    installation.access_tokens_url
  );
  const installationRepositories = await github.getPaginated(
    installationToken.token,
    installation.repositories_url,
    result => result.repositories
  );
  const repositories = installationRepositories.filter(
    repository =>
      repository.owner.id === installation.account.id &&
      repository.fork === false &&
      repository.archived === false
  );

  logger.debug({ url: installation.html_url }, "auditing installation");

  const auditResults = [];
  for (const repository of repositories) {
    const results = await auditRepository(installationToken.token, repository);
    auditResults.push({ repository, results });
  }
  return auditResults;
}

module.exports = auditInstallation;
