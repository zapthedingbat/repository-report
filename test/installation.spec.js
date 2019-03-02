const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Installation', function () {
  let sandbox;
  let github;
  let processRepository;

  before(function () {
    sandbox = sinon.createSandbox();
    github = {
      post: sandbox.stub(),
      getPaginated: sandbox.stub()
    };
    processRepository = sandbox.stub();
    renderHtml = sandbox.stub();
    processInstallationRepositories = proxyquire('../src/installation', {
      './github': github,
      './repository': processRepository,
      './report/render-html': renderHtml,
    });
  });
  
  afterEach(function () {
    sandbox.restore();
  });
  
  it('should process the repositories for an installation', async function () {
    github.post.resolves({ token: 'test installation token' });
    const mockRepositories = [
      { owner: { login: 'test owner' }, fork: false, archived: false },
      { owner: { login: 'test owner' }, fork: false, archived: false }
    ]
    const mockResults = {};
    github.getPaginated.resolves(mockRepositories);
    processRepository.resolves(mockResults);
    const generateReport = sandbox.stub();
    await processInstallationRepositories({
      access_tokens_url: 'test access_tokens_url',
      repositories_url: 'test repositories_url'
    }, 'test owner', 'test token', generateReport);

    sinon.assert.calledWith(github.post, 'test token', 'test access_tokens_url');
    sinon.assert.calledWith(github.getPaginated, 'test installation token', 'test repositories_url?type=sources');
    sinon.assert.calledWith(processRepository, 'test installation token', mockRepositories[0]);
    sinon.assert.calledWith(processRepository, 'test installation token', mockRepositories[1]);
    sinon.assert.calledWith(generateReport, mockRepositories[0], mockResults);
    sinon.assert.calledWith(generateReport, mockRepositories[1], mockResults);
  });
});
