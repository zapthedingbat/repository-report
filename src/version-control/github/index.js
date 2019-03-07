const path = require('path');
const createCachedFetch = require("../../lib/cache-fetch");
const getAppToken = require('./get-app-token');
const createApi = require("./api");

// Cache http requests on the file system
const cacheDir = path.join(__dirname, "../../../.cache-test");
const cachedFetch = createCachedFetch(cacheDir);
const api = createApi(cachedFetch);

// Maps a github repository to a generic one
function createRepository(repository) {
  return {
    title: repository.name,
    url: repository.html_url,
    settingsUrl: repository.html_url + '/settings',
    description: repository.description
  }
}

function createGetRepositories(appToken, accessTokensUrl, repositoriesUrl) {
  return async function getRepositories() {
    const response = await api.request(appToken, 'POST', accessTokensUrl);
    const { token } = await response.json();
    const githubRepos = await api.getPaginated(token, 'GET', repositoriesUrl, items => items.repositories);
    return githubRepos.map(repo => createRepository(repo));
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
    const installations = await api.getInstallations(appToken);
    return installations.map(installation => createReportGroup(appToken, installation));
  }
}

module.exports = exports = async function create() {
  const appToken = await getAppToken();
  return {
    getReportGroups: createGetReportGroups(appToken)
  }
}
