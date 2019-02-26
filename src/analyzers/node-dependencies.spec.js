const chai = require('chai');
const sinon = require('sinon');
const { nodeDependencies } = require('./node-dependencies');

describe('Node Dependencies Analyzer', function () {
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

    await nodeDependencies(['/test/package.json', '/test/other'], getFileContentsFn);

    sinon.assert.calledWith(getFileContentsFn, '/test/package.json');
  });
});
