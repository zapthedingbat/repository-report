const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const workingDirectory = require('./working-directory');
const github = require('./github');

// Load github app key
const keyPath = path.join(__dirname, '../.keys/github-private-key.pem');

async function worker() {
  
  const appId = process.env.GITHUB_APP_IDENTIFIER;
  const key = fs.readFileSync(keyPath);
  const appToken = await github.getAppToken(key, appId);
  const installations = await github.getInstallations(appToken);
  
  for (const installation of installations) {

    const installationToken = await github.post(appToken, installation.access_tokens_url);
    const installationRepositories = await github.get(installationToken.token, installation.repositories_url);
    for (const repository of installationRepositories.repositories) {

      // Prepare the working directory to clone into
      const localWorkingDirectory = workingDirectory.prepare(repository.owner.login, repository.name);

      console.log(localWorkingDirectory);

      // Clone repository to working directory
      await github.clone(installationToken.token, repository.clone_url, localWorkingDirectory);

      // TODO:
      // - Find the dependencies of each repository
      // - Record each dependency
    }
  }
};

module.exports = worker;
