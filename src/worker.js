const fs = require('fs');
const path = require('path');
const github = require('./github');
const processInstallationRepositories = require("./installation");

// Load github app key
const keyPath = path.join(__dirname, '../.keys/github-private-key.pem');

async function worker() {
  const appId = process.env.GITHUB_APP_IDENTIFIER;
  const owner = process.env.GITHUB_OWNER;
  const key = fs.readFileSync(keyPath);
  const appToken = await github.getAppToken(key, appId);
  const installations = await github.getInstallations(appToken);
  
  for (const installation of installations) {
    await processInstallationRepositories(installation, owner, appToken);
  }
};

module.exports = worker;
