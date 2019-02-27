const github = require('./github');
const renderHtml = require('./report/render-html');
const { processRepository } = require("./repository");

async function processInstallationRepositories(installation, owner, token) {
  const installationToken = await github.post(token, installation.access_tokens_url);
  const installationRepositories = await github.getPaginated(installationToken.token, installation.repositories_url + '?type=sources', result => result.repositories);
  const repositories = installationRepositories.filter(repository => repository.owner.login === owner && repository.fork === false && repository.archived === false);
  for (const repository of repositories) {
    const reports = await processRepository(installationToken.token, repository);
    renderHtml({
      repository,
      reports
    });
  }
}

module.exports = processInstallationRepositories;
