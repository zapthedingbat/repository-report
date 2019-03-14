const { expect } = require('chai');
const proxyquire = require('proxyquire');

describe('Loader', function () {
  let loader;
  let rootDir;
  let subDir;
  let testModule1;

  before(function () {
    rootDir = 'root';
    subDir = 'subdir';
    testModule1 = 1;
    testModule2 = 2;
    loader = proxyquire
      .noCallThru()
      .noPreserveCache()
      .load('../../src/lib/loader', {
        "fs": {
          "readdirSync": () => ['file1.js', 'file2.js']
        },
        "path": {
          resolve: (...args) => args.join('-'),
          join: (...args) => args.join('-')
        },
        "root-subdir-test1": testModule1,
        "root-subdir-test2": testModule2,
        "root-subdir-file1.js": testModule1,
        "root-subdir-file2.js": testModule2
      })
  })

  describe('when a list of modules is supplied', function () {
    it('should require each javascript file in the given list', function () {
      
      const load = loader(rootDir);
      const modules = load(subDir, 'test1,test2');

      expect(modules).to.eql({test1: 1, test2: 2});
    })
  });

  describe('when a wildcard is supplied', function () {
    it('should require each javascript file in the given directory', function () {
      
      const load = loader(rootDir);
      const modules = load(subDir, '*');

      expect(modules).to.eql({file1: 1, file2: 2});
    })
  });

})
