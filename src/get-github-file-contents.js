const github = require('./github');

function getGithubFileContents(token, owner, name, branch) {
  return async function (path) {
    return github.getFileContents(token, owner, name, branch, path);
  };
}

module.exports = {
  getGithubFileContents
}
