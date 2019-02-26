const github = require('./github');
const { nodeDependencies } = require('./analyzers/node-dependencies');
const { getGithubFileContents } = require('./get-github-file-contents');

async function processRepository(token, repository) {
  // Get a list of path of all files
  const files = await github.getTreeFiles(token, repository.owner.login, repository.name, repository.default_branch);
  const filePaths = files.tree.map(file => file.path);
  const getFileContentsFn = getGithubFileContents(token, repository.owner.login, repository.name, repository.default_branch);
  
  // TODO: Move this out to a list of analyzers that are run
  const dependencies = await nodeDependencies(filePaths, getFileContentsFn);
  console.log(repository.full_name, JSON.stringify(dependencies));
}

module.exports = {
  processRepository
}
