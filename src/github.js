const fetch = require('node-fetch');
const { spawn } = require('child_process');
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
  const cloneUrl = new URL(url);
  cloneUrl.username = 'x-access-token';
  cloneUrl.password = token;

  console.log(`Cloning ${cloneUrl.href} into ${localWorkingDirectory}`);

  return new Promise((resolve, reject) => {

    console.log('spawn', spawn);

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

  // const options = {
  //   fetchOpts: {
  //     callbacks: {
  //       certificateCheck: function () { return 1; },
  //       credentials: function () {
  //         return NodeGit.Cred.userpassPlaintextNew('x-access-token', token);
  //       }
  //     }
  //   }
  // };
  
  // return ghGot.Clone(url, localWorkingDirectory, options);
}

module.exports = {
  clone,
  get,
  getInstallations,
  getAppToken,
  post,
}
