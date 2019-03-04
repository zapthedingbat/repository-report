const github = require("./github");

function createGithubReadFile(token, owner, name, branch) {
  return async function(path) {
    return github.readFile(token, owner, name, branch, path);
  };
}

module.exports = createGithubReadFile;
