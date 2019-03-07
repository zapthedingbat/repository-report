function defaultItemsFn(items) {
  return items;
}

module.exports = exports = function createGetPaginated(accessToken, api) {
  return async function getPaginated(url, itemsFn = defaultItemsFn) {
    let nextUrl = url;
    const items = [];

    while (nextUrl) {
      const response = await api.get(accessToken, nextUrl, "GET");
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
