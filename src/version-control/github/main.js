const { join: joinPath } = require("path");
const { sign } = require("jsonwebtoken");
const logger = require("../../lib/logger");
const createCacheFetch = require("../../lib/cache-fetch");

const cacheDir = joinPath(__dirname, "../.cache");
const cacheFetch = createCacheFetch(cacheDir);

function githubFetch(token, url, method) {
  return cacheFetch(url, {
    method: method ? method : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.machine-man-preview+json"
    }
  });
}

async function get(token, url) {
  return (await githubFetch(token, url, "GET")).json();
}

async function getPaginated(token, url, itemsFn) {
  let nextUrl = url;
  const items = [];

  while (nextUrl) {
    const response = await githubFetch(token, nextUrl, "GET");
    nextUrl = null;
    if (response.status === 204) {
      break;  
    }
    const result = await response.json();
    items.push(...itemsFn(result));
    const linkHeader = response.headers.get("link");
    let match;
    if (linkHeader && (match = linkHeader.match(/<([^>]+)>; rel="next"/))) {
      nextUrl = match[1];
    }
  }

  return items;
}

async function post(token, url) {
  return (await githubFetch(token, url, "POST")).json();
}

function getAppToken(key, appId) {
  const payload = {
    iss: appId
  };
  return sign(payload, key, { algorithm: "RS256", expiresIn: "5m" });
}

async function getInstallations(token) {
  return get(token, "https://api.github.com/app/installations");
}

async function getTreeFiles(token, owner, repo, branch) {
  // TODO: Make this recursive - https://developer.github.com/v3/git/trees/#get-a-tree
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  const result = await get(token, url);

  if (!result.tree) {
    return { tree: [] };
  }

  return result;
}

async function readFile(token, owner, repo, branch, path) {
  const encodedPath = encodeURIComponent(path);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}?ref=${branch}`;
  const file = await get(token, url);
  try {
    return Buffer.from(file.content, "base64").toString("utf8");
  } catch (err) {
    logger.error({ err, url, file }, "Error parsing file content");
    throw err;
  }
}

module.exports = {
  get,
  getAppToken,
  readFile,
  getInstallations,
  getPaginated,
  getTreeFiles,
  post
};
