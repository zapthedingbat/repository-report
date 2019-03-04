const fs = require("fs");
const path = require("path");

function writeFiles(dir, extension = "report") {
  return function createWriter(name) {
    const stream = fs.createWriteStream(path.join(dir, `${name}.${extension}`));
    return function writer(data) {
      return new Promise((resolve, reject) => {
        stream.write(data, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    };
  };
}

module.exports = exports = writeFiles;
