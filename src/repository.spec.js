const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Repository', function () {
  let sandbox;
  let github;
  let readFile;
  let audits;

  before(function () {
    sandbox = sinon.createSandbox();
    github = { getTreeFiles: sandbox.stub() };
    audit = sandbox.stub();
    readFile = sandbox.stub();
    createGithubReadFile = sandbox.stub().returns(readFile);
    ({ processRepository } = proxyquire('./repository', {
      './github': github,
      './audits': audit,
      './create-github-read-file': createGithubReadFile
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

    await processRepository('test token', {
      owner: { login: 'test login' },
      name: 'test name',
      default_branch: 'test default_branch'
    });

    sinon.assert.calledWith(createGithubReadFile, 'test token', 'test login', 'test name', 'test default_branch');
    sinon.assert.calledWith(audit,
      { filePaths: ['test file path one', 'test file path two'] }, 
      { readFile }
    );
  });
});
