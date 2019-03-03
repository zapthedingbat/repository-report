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
    processInstallationRepositories = proxyquire('../src/installation', {
      './github': github,
      './repository': processRepository
    });
  });
  
  afterEach(function () {
    sandbox.restore();
  });
  
  it('should audit the repositories for an installation', async function () {
    github.post.resolves({ token: 'test installation token' });
    const mockRepositories = [
      { owner: { login: 'test owner' }, fork: false, archived: false },
      { owner: { login: 'test owner' }, fork: false, archived: false }
    ]
    const mockResults = {};
    github.getPaginated.resolves(mockRepositories);
    processRepository.resolves(mockResults);

    await processInstallationRepositories({
      access_tokens_url: 'test access_tokens_url',
      repositories_url: 'test repositories_url'
    }, 'test owner', 'test token');

    sinon.assert.calledWith(github.post, 'test token', 'test access_tokens_url');
    sinon.assert.calledWith(github.getPaginated, 'test installation token', 'test repositories_url?type=sources');
    sinon.assert.calledWith(processRepository, 'test installation token', mockRepositories[0]);
    sinon.assert.calledWith(processRepository, 'test installation token', mockRepositories[1]);
  });
});
