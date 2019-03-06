const { join: joinPath } = require("path");
const createCacheFetch = require("./cache-fetch");

const cacheDir = joinPath(__dirname, "./.cache-confluence");
const cacheFetch = createCacheFetch(cacheDir);
const username = process.env.CONFLUENCE_USER;
const password = process.env.CONFLUENCE_PASSWORD;

module.exports = exports = async function getConfluencePages(url) {
  const textQuery = url.replace(/[^a-z0-9]/gi, '?');
  const response = await cacheFetch(`https://confluence.condenastint.com/rest/api/search?cql=text~"${textQuery}"%20and%20type=page&os_authType=basic`, {
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
