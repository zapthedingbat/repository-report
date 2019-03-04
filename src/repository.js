const github = require('./github');
const createGithubReadFile = require('./create-github-read-file');
const audit = require('./audits');
const logger = require('./logger');

module.exports = async function auditRepository(token, repository) {

  logger.debug({ name: repository.full_name }, 'auditing repository');

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
