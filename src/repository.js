const github = require('./github');
const { getGithubFileContents } = require('./get-github-file-contents');
const { run } = require('./audits');

async function processRepository(token, repository) {
  const files = await github.getTreeFiles(token, repository.owner.login, repository.name, repository.default_branch);
  const filePaths = files.tree.map(file => file.path);
  const getFileContents = getGithubFileContents(token, repository.owner.login, repository.name, repository.default_branch);
  
  const assets = {
    filePaths
  }

  const context = {
    getFileContents
  }

  await run(assets, context);
}

module.exports = {
  processRepository
}
