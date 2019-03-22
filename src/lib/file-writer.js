const fs = require("fs");
const path = require("path");

module.exports = exports = function createWriter(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return function write(reportName, chunk, rendererName) {
    const stream = fs.createWriteStream(path.join(directory, `${reportName}.${rendererName}`));
    return new Promise((resolve, reject) => {
      stream.write(chunk, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
        stream.close();
      });
    });
  };
};
