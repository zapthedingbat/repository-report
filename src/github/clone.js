const { spawn } = require('child_process');

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

module.exports = exports = clone
