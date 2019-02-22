const fs = require('fs');
const path = require('path');
const github = require('./github');
const analyzer = require('./analyzer');

// Load github app key
const keyPath = path.join(__dirname, '../.keys/github-private-key.pem');

function createGetFileContentsFn(token, owner, name, branch) {
  return async function (path) {
    return github.getFileContents(
      token,
      owner,
      name,
      branch,
      path
    );
  }
}

async function worker() {
  
  const appId = process.env.GITHUB_APP_IDENTIFIER;
  const owner = process.env.GITHUB_OWNER;
  const key = fs.readFileSync(keyPath);
  const appToken = await github.getAppToken(key, appId);
  const installations = await github.getInstallations(appToken);
  
  for (const installation of installations) {
    
    const installationToken = await github.post(appToken, installation.access_tokens_url);
    const installationRepositories = await github.getPaginated(installationToken.token, installation.repositories_url + '?type=sources', result => result.repositories);
    
    const dependenciesOutputStream = fs.createWriteStream('./dependencies.csv');
    for (const repository of installationRepositories.filter(repository => repository.owner.login === owner && repository.fork === false && repository.archived === false)) {
      const files = await github.getTreeFiles(
        installationToken.token,
        repository.owner.login,
        repository.name,
        repository.default_branch
      )

      if (!files.tree) {
        continue;
      }

      const filePaths = files.tree.map(file => file.path);
      
      const getFileContentsFn = createGetFileContentsFn(
        installationToken.token,
        repository.owner.login,
        repository.name,
        repository.default_branch
      );
      await analyzer.analyzeDependencies(dependenciesOutputStream, repository.full_name, filePaths, getFileContentsFn);
    }
    dependenciesOutputStream.end();
  }
};

module.exports = worker;
