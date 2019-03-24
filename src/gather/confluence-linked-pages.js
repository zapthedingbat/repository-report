const { join: joinPath } = require("path");
const createCacheExclude = require("../lib/cache-exclude");
const createGetHash = require("../lib/get-hash");
const createCacheFetch = require("../lib/cache-fetch");

const cacheDir = joinPath(__dirname, "../../.output/cache/confluence");
const cacheExclude = createCacheExclude([]);
const getHash = createGetHash([]);
const cacheFetch = createCacheFetch(cacheDir, getHash, cacheExclude);


module.exports = exports = async function getConfluenceLinkedPages(repository) {
  const username = process.env.CONFLUENCE_USER;
  const password = process.env.CONFLUENCE_PASSWORD;
  const origin = process.env.CONFLUENCE_ORIGIN;
  const textQuery = repository.url.replace(/[^a-z0-9]/gi, '?');
  const response = await cacheFetch(`${origin}/rest/api/search?cql=text~"${textQuery}"%20and%20type=page&os_authType=basic`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${Buffer.from(username + ':' + password).toString('base64')}`
    }
  })
  const json = await response.json();
  const base = json._links.base;
  return json.results.map(result => ({
    title: result.content.title,
    url: base + result.content._links.webui
  }));
}
