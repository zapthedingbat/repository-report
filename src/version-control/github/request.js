module.exports = exports = function createRequest(fetch) {
  return function request(token, method, url) {
    return fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.machine-man-preview+json"
      }
    });
  }
}
