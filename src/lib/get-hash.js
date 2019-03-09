const crypto = require("crypto");

module.exports = exports = function create(includeHeaderUrls) {
  return function getHash(input, init) {
    const url = typeof input === "string" ? input : input.url;

    let payload = url;
    if (includeHeaderUrls.some(pattern => pattern.test(url))) {
      let headers = {};
      if (init && init.headers) {
        headers = init.headers
      }
      payload += JSON.stringify(headers);
    }
    
    const hashAlgo = crypto.createHash("md5");
    return hashAlgo.update(payload).digest("hex");
  }
}
