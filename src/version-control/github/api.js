const createRequest = require("./request");

function createGetPaginated(request) {
  return async function getPaginated(token, method, url, itemsFn) {
    let nextUrl = url;
    const items = [];

    while (nextUrl) {
      const response = await request(token, method, nextUrl);
      nextUrl = null;
      if (response.status === 204) {
        break;
      }
      const result = await response.json();
      items.push(...itemsFn(result));
      const linkHeader = response.headers.get("link");
      let match;
      if (linkHeader && (match = linkHeader.match(/<([^>]+)>; rel="next"/))) {
        nextUrl = match[1];
      }
    }

    return items;
  }
}

function createGetInstallations(request) {
  return async function (appToken) {
    const response = await request(appToken, "GET", "https://api.github.com/app/installations");
    return await response.json();
  }
}

function createGetFiles(request) {
  return async function getFiles(token, owner, repo, branch) {
    // TODO: Make this recursive - https://developer.github.com/v3/git/trees/#get-a-tree
    const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
    const result = await request(token, "GET", url);

    if (!result.tree) {
      return { tree: [] };
    }

    return result;
  }
}

function createReadFile(request) {
  return async function readFile(token, owner, repo, branch, path) {
    const encodedPath = encodeURIComponent(path);
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}?ref=${branch}`;
    const file = await request(token, "GET", url);
    try {
      return Buffer.from(file.content, "base64").toString("utf8");
    } catch (err) {
      logger.error({ err, url, file }, "Error parsing file content");
      throw err;
    }
  }
}

module.exports = exports = function create(fetch) {
  const request = createRequest(fetch);
  return {
    getInstallations: createGetInstallations(request),
    getFiles: createGetFiles(request),
    getPaginated: createGetPaginated(request),
    readFile: createReadFile(request),
    request
  }
}
