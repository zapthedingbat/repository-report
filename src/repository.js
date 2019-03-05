const github = require("./github");
const createGithubReadFile = require("./create-github-read-file");
const logger = require("./logger");
const maturityModel = require("./maturity-model");

module.exports = async function auditRepository(token, repository) {
  logger.debug({ name: repository.full_name }, "auditing repository");

  // Gather artifacts
  const files = await github.getTreeFiles(
    token,
    repository.owner.login,
    repository.name,
    repository.default_branch
  );
  const filePaths = files.tree.map(file => file.path);
  
  let contributors = await github.getPaginated(token, repository.contributors_url, x => x);
  
  const artifacts = {
    repository,
    filePaths,
    contributors
  };

  // Construct context
  const readFile = createGithubReadFile(
    token,
    repository.owner.login,
    repository.name,
    repository.default_branch
  );

  const context = {
    readFile
  };

  // Apply auditing methods
  const classification = await maturityModel.classify(artifacts, context);

  return {
    artifacts,
    classification
  }
};
