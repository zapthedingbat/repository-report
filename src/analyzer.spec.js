const chai = require('chai');
const sinon = require('sinon');
const analyzer = require('./analyzer');

describe('Analyzer', function () {
  let sandbox;

  before(function () {
    sandbox = sinon.createSandbox();
  });
  
  afterEach(function () {
    sandbox.restore();
  });

  it('should get the contents of the package.json file', async function () {
    const getFileContentsFn = sandbox.stub().resolves(`{
      "dependencies": {"a":"1","b":"2"},
      "devDependencies": {"c":"3","d":"4"}
    }`);
    const outputStream = { write: sandbox.stub() };

    await analyzer.analyzeDependencies(outputStream, 'test repository', ['/test/package.json', '/test/other'], getFileContentsFn);

    sinon.assert.calledWith(getFileContentsFn, '/test/package.json');
  });
});
