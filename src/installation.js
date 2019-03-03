const github = require('./github');
const auditRepository = require("./repository");

async function auditInstallation(installation, owner, token) {
  const installationToken = await github.post(token, installation.access_tokens_url);
  const installationRepositories = await github.getPaginated(installationToken.token, installation.repositories_url + '?type=sources', result => result.repositories);
  const repositories = installationRepositories.filter(repository => repository.owner.login === owner && repository.fork === false && repository.archived === false);

  const auditResults = [];
  for (const repository of repositories) {
    const results = await auditRepository(installationToken.token, repository);
    auditResults.push({ repository, results });
  }
  return auditResults;
}

module.exports = auditInstallation;
