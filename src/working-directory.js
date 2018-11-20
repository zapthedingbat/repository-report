const os = require('os');
const fs = require('fs');
const path = require('path');

function removeDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(function(file){
      const current = path.join(dir, file);
      if (fs.lstatSync(current).isDirectory()) {
        removeDirectory(current);
      } else {
        fs.unlinkSync(current);
      }
    });
    fs.rmdirSync(dir);
  };
}

function createWorkingDirectoryPath(owner, name) {
  let dir = path.join(os.tmpdir(), 'github-tech-report');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  dir = path.join(dir, owner);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  return path.join(dir, name);
}

function prepare(owner, name) {
  const workingDirectoryPath = createWorkingDirectoryPath(owner, name);
  if (fs.existsSync(workingDirectoryPath)) {
    removeDirectory(workingDirectoryPath);
  }
  fs.mkdirSync(workingDirectoryPath);
  return workingDirectoryPath;
}

module.exports = {
  prepare
}
