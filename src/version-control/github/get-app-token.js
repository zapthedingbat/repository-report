const { sign } = require("jsonwebtoken");
const { readFileSync } = require("fs");
const path = require("path");

const keyPath = path.resolve(require.main.filename, "../../.keys/github-private-key.pem");

module.exports = exports = function getAppToken() {
  const appId = process.env.GITHUB_APPID;
  const key = readFileSync(keyPath);
  const payload = {
    iss: appId
  };
  return sign(payload, key, { algorithm: "RS256", expiresIn: "10m" });
}
