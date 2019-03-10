module.exports = exports = function create(excludeUrls) {
  return function cacheMatch(input) {
    const url = typeof input === "string" ? input : input.url;
    return !excludeUrls.some(pattern => pattern.test(url));
  }
}
