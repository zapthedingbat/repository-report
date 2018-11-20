const fetch = require('node-fetch');
const NodeGit = require('nodegit');
const { sign } = require('jsonwebtoken');

function getAppToken(key, appId) {
  const payload = {
    iss: appId
  }
  return sign(payload, key, { algorithm: 'RS256', expiresIn: '5m' });
}

async function get(token, url) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.machine-man-preview+json"
    }
  })
  return await response.json();
}

async function post(token, url) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.machine-man-preview+json"
    }
  });
  return await response.json();
}

async function getInstallations(token) {
  return get(token, 'https://api.github.com/app/installations');
}

function clone(token, url, localWorkingDirectory) {
  const options = {
    fetchOpts: {
      callbacks: {
        certificateCheck: function () { return 1; },
        credentials: function () {
          return NodeGit.Cred.userpassPlaintextNew('x-access-token', token);
        }
      }
    }
  };
  
  return NodeGit.Clone(url, localWorkingDirectory, options);
}

module.exports = {
  clone,
  get,
  getInstallations,
  getAppToken,
  post,
}
