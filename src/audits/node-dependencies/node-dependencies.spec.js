const chai = require('chai');
const sinon = require('sinon');
const { audit } = require('./node-dependencies');

describe('Node Dependencies Audit', function () {
  let sandbox;

  before(function () {
    sandbox = sinon.createSandbox();
  });
  
  afterEach(function () {
    sandbox.restore();
  });

  it('should get the contents of the package.json file', async function () {
    const getFileContents = sandbox.stub().resolves(`{
      "dependencies": {"a":"1","b":"2"},
      "devDependencies": {"c":"3","d":"4"}
    }`);

    await audit(
      { filePaths: ['/test/package.json', '/test/other'] },
      { getFileContents }
    );

    sinon.assert.calledWith(getFileContents, '/test/package.json');
  });
});
