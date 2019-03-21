const { expect } = require('chai');
const createGetHash = require('../../src/lib/get-hash');

describe('Get hash', function () {
  describe('when url matches includeHeaderUrls array', function () {

    it('should generate a hash from the url and headers', function () {
      const getHash = createGetHash([/test url/]);
      
      const hash = getHash('test url', { headers: 'test' });
      
      expect(hash).to.equal('00e3d9eb7af9fdc650b4f3c3865511b7');
    })
  })

  describe('when doesn\'t matches includeHeaderUrls array', function () {

    it('should generate a hash from the url', function () {
      const getHash = createGetHash([/^no match$/]);
      
      const hash = getHash('test url');
      
      expect(hash).to.equal('5fde70d49126bcece841f5d5499b9b1d');
    })
  })
})
