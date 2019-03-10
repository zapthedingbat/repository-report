const fs = require("fs");
const { join: joinPath } = require("path");
const { promisify } = require("util");
const { default: fetch, Response } = require("node-fetch");
const logger = require("./logger");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);

module.exports = exports = function create(cachePath, getHash, cachePredicate) {
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }

  return async function cachedFetch(input, init) {
    const url = typeof input === "string" ? input : input.url;
    if (!url.startsWith('https://')) {
      const x = new Error();
      throw x.stack;
    }
    const hash = getHash(input, init);
    const cacheFile = joinPath(cachePath, hash);

    let cacheObject;

    if (cachePredicate(input, init) && await exists(cacheFile)) {
      cacheObject = JSON.parse(await readFile(cacheFile));
      logger.trace(
        { hash, cached: true, url, status: cacheObject.init.status },
        "fetch"
      );
    } else {
      const response = await fetch(input, init);
      cacheObject = {
        init: {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers.raw()
        },
        body: await response.text()
      };

      // Only cache successful requests
      if (response.status < 299 || response.status == 404) {
        await writeFile(cacheFile, JSON.stringify(cacheObject));
      }

      logger.trace(
        { hash, cached: false, url, status: cacheObject.init.status },
        "fetch"
      );
    }

    return new Response(cacheObject.body, cacheObject.init);
  };
}
