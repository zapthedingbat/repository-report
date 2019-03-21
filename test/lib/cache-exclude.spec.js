const { expect } = require('chai');
const createCacheExclude = require('../../src/lib/cache-exclude');

describe('cache exclude', function () {
  it('should return true when the request url does not match the specified regular expressions', function () {
    const cacheExclude = createCacheExclude([/^not matching$/]);

    const actual = cacheExclude('url');

    expect(actual).to.be.true;
  })

  it('should return false when the request url matches the specified regular expressions', function () {
    const cacheExclude = createCacheExclude([/url/]);

    const actual = cacheExclude('url');

    expect(actual).to.be.false;
  })

  it('should use the url property if the input argument is an object', function () {
    const cacheExclude = createCacheExclude([/url/]);

    const actual = cacheExclude({ url: 'url' });

    expect(actual).to.be.false;
  })
})
