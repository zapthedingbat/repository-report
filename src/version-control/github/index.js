const path = require('path');
const createCachedFetch = require("../../lib/cache-fetch");
const createCacheExclude = require("../../lib/cache-exclude");
const createGetHash = require('../../lib/get-hash');
const getAppToken = require('./get-app-token');
const createApi = require("./api");
const logger = require("../../lib/logger");

const cacheDir = path.join(__dirname, "../../../.cache");
const cacheExclude = createCacheExclude([/\/access_tokens$/]);
const getHash = createGetHash([/\/installation\/repositories/]);
const cachedFetch = createCachedFetch(cacheDir, getHash, cacheExclude);
const api = createApi(cachedFetch);

function createGetFilePaths(token, owner, repo, branch) {
  return function getFilePaths() {
    return api.getFilePaths(token, owner, repo, branch);
  }
}

function createGetContributors(token, contributorsUrl) {
  return async function getContributors() {
    const githubContributors = await api.getPaginated(token, 'GET', contributorsUrl, items => items);
    return githubContributors.map(createContributor);
  }
}

function createReadFile(token, owner, repo, branch) {
  return function readFile(path) {
    return api.readFile(token, owner, repo, branch, path);
  }
}

function createContributor(contributor) {
  return {
    name: contributor.login,
    url: contributor.html_url,
    imageUrl: contributor.avatar_url,
    contributions: contributor.contributions
  };
}

function createRepository(repository, token) {
  return {
    title: repository.name,
    url: repository.html_url,
    settingsUrl: repository.html_url + '/settings',
    description: repository.description,
    createdAt: new Date(repository.created_at),
    pushedAt: new Date(repository.pushed_at),
    getFilePaths: createGetFilePaths(token, repository.owner.login, repository.name, repository.default_branch),
    getContributors: createGetContributors(token, repository.contributors_url),
    readFile: createReadFile(token, repository.owner.login, repository.name, repository.default_branch)
  }
}

function createGetRepositories(appToken, accessTokensUrl, repositoriesUrl) {
  return async function getRepositories() {
    const response = await api.request(appToken, 'POST', accessTokensUrl);
    const { token } = await response.json();
    const githubRepos = await api.getPaginated(token, 'GET', repositoriesUrl, items => items.repositories);
    return githubRepos.map(repo => createRepository(repo, token));
  }
}

function createReportGroup(appToken, installation) {
  return {
    name: installation.account.login,
    imageUrl: installation.account.avatar_url,
    description: installation.account.description,
    getRepositories: createGetRepositories(appToken, installation.access_tokens_url, installation.repositories_url)
  }
}

function createGetReportGroups(appToken) {
  return async function getReportGroups() {
    let installations = await api.getInstallations(appToken);
    const list = process.env.GITHUB_INSTALLATIONS || '*';
    if (list !== '*') {
      const installationNames = list.split(',').filter(name => name !== '');
      installations = installations.filter(installation => installationNames.includes(installation.account.login))
    }

    return installations
      .map(installation => createReportGroup(appToken, installation));
  }
}

module.exports = exports = async function create() {
  const appToken = await getAppToken();
  return {
    getReportGroups: createGetReportGroups(appToken)
  }
}
