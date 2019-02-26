const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Repository', function () {
  let sandbox;
  let github;
  let getFileContents;
  let nodeDependencies;
  let processRepository;

  before(function () {
    sandbox = sinon.createSandbox();
    github = {
      getTreeFiles: sandbox.stub()
    };
    nodeDependencies = sandbox.stub();
    getFileContents = sandbox.stub();
    createGetFileContents = sandbox.stub().returns(getFileContents);
    ({ processRepository } = proxyquire('./repository', {
      './github': github,
      './analyzers/node-dependencies': { nodeDependencies },
      './get-github-file-contents': { getGithubFileContents: createGetFileContents }
    }));
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should get a list of the file paths in the repo', async function () {
    github.getTreeFiles.resolves({
      tree: [
        { path: 'test file path one' },
        { path: 'test file path two' }
      ]
    });
    nodeDependencies.resolves();

    await processRepository('test token', {
      owner: { login: 'test login' },
      name: 'test name',
      default_branch: 'test default_branch'
    });

    sinon.assert.calledWith(createGetFileContents, 'test token', 'test login', 'test name', 'test default_branch');
    sinon.assert.calledWith(nodeDependencies, ['test file path one', 'test file path two'], getFileContents);
  });
});
