const fetch = require('node-fetch');
const { spawn } = require('child_process');
const { sign } = require('jsonwebtoken');

function githubFetch(token, url, method) {
  return fetch(url, {
    method: method ? method : 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.machine-man-preview+json"
    }
  })
}

async function get(token, url) {
  return (await githubFetch(token, url, 'GET')).json();
}

async function getPaginated(token, url, itemsFn) {

  let nextUrl = url;
  const items = [];

  while (nextUrl) {
    const response = await githubFetch(token, nextUrl, 'GET');
    nextUrl = null;
    const result = await response.json();
    items.push(...itemsFn(result));
    const linkHeader = response.headers.get('link');
    let match;
    if (linkHeader && (match = linkHeader.match(/<([^>]+)>; rel="next"/))) {
      nextUrl = match[1];
    }
  }
  
  return items;
}

async function post(token, url) {
  return (await githubFetch(token, url, 'POST')).json();
}

function getAppToken(key, appId) {
  const payload = {
    iss: appId
  }
  return sign(payload, key, { algorithm: 'RS256', expiresIn: '5m' });
}

async function getInstallations(token) {
  return get(token, 'https://api.github.com/app/installations');
}

async function getTreeFiles(token, owner, repo, branch) {
  // TODO: Make this recursive - https://developer.github.com/v3/git/trees/#get-a-tree
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  return get(token, url);
}

async function getFileContents(token, owner, repo, branch, path) {
  const encodedPath = encodeURIComponent(path);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}?ref=${branch}`;
  const file = await get(token, url);
  return Buffer.from(file.content, 'base64').toString('utf8');
}

function clone(token, url, localWorkingDirectory) {
  const cloneUrl = new URL(url);
  cloneUrl.username = 'x-access-token';
  cloneUrl.password = token;

  return new Promise((resolve, reject) => {
    const gitProcess = spawn('git', [
      'clone',
      cloneUrl.href,
      localWorkingDirectory,
    ]);
    
    gitProcess.on('close', function (code) {
      if (code === 0) {
        resolve(localWorkingDirectory);
      } else {
        reject(`child process exited with code ${code}`);
      }
    });
  });
}

module.exports = {
  clone,
  get,
  getAppToken,
  getFileContents,
  getInstallations,
  getPaginated,
  getTreeFiles,
  post,
}
