const crypto = require('crypto');
const fs = require('fs');
const { join: joinPath } = require('path');
const { promisify } = require('util');
const { default: fetch, Response } = require('node-fetch');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);

function getHash(url) {

  const hashAlgo = crypto.createHash('md5');
  return hashAlgo.update(url).digest('hex');
}

function create(cachePath) {
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }
  return async function cachedFetch(input, init) {
    const url = typeof input === 'string' ? input : input.url;
    const hash = getHash(url);
    const cacheFile = joinPath(cachePath, hash);

    if (!await exists(cacheFile)) {
      const response = await fetch(input, init);
      await writeFile(cacheFile, JSON.stringify({
        init: {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers.raw()
        },
        body: await response.text()
      }));
    }

    const cached = JSON.parse(await readFile(cacheFile));
    return new Response(cached.body, cached.init);
  }
};

module.exports = exports = create;
exports.GetHash = getHash;
