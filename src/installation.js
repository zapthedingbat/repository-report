const github = require('./github');
const processRepository = require("./repository");

async function processInstallationRepositories(installation, owner, token, generateReport) {
  const installationToken = await github.post(token, installation.access_tokens_url);
  const installationRepositories = await github.getPaginated(installationToken.token, installation.repositories_url + '?type=sources', result => result.repositories);
  const repositories = installationRepositories.filter(repository => repository.owner.login === owner && repository.fork === false && repository.archived === false);

  for (const repository of repositories) {
    const results = await processRepository(installationToken.token, repository);
    await generateReport(repository, results);
  }
}

module.exports = processInstallationRepositories;
