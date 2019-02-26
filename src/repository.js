const github = require('./github');
const createGithubReadFile = require('./create-github-read-file');
const audit = require('./audits');

async function processRepository(token, repository) {
  const files = await github.getTreeFiles(token, repository.owner.login, repository.name, repository.default_branch);
  const filePaths = files.tree.map(file => file.path);
  const readFile = createGithubReadFile(token, repository.owner.login, repository.name, repository.default_branch);
  
  const assets = {
    filePaths
  }

  const context = {
    readFile
  }

  return await audit(assets, context);
}

module.exports = {
  processRepository
}
