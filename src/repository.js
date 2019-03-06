const github = require("./github");
const createGithubReadFile = require("./create-github-read-file");
const logger = require("./logger");
const maturityModel = require("./maturity-model");
const getConfluencePages = require('./get-confluence-pages');

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
  
  const githubContributors = await github.getPaginated(token, repository.contributors_url, x => x);
  const contributors = githubContributors.map(contributor => ({
    title: contributor.login,
    url: contributor.html_url,
    imageUrl: contributor.avatar_url + '&s=40',
    contributions: contributor.contributions
  })).sort((a, b) => b.contributions - a.contributions);

  const runbooks = await getConfluencePages(repository.html_url);
  const artifacts = {
    repository,
    filePaths,
    contributors,
    runbooks
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
