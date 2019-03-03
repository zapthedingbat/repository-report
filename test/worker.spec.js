const sinon = require('sinon');
const dotenv = require('dotenv');
const fs = require('fs');
const proxyquire = require('proxyquire');
const github = require('../src/github');

describe('Worker', function () {
  let sandbox;
  let processInstallationRepositories;
  let worker;

  before(function () {
    sandbox = sinon.createSandbox();
    sandbox.stub(dotenv, 'config');
    process.env.GITHUB_APP_IDENTIFIER = '';
    process.env.GITHUB_OWNER = ''
    sandbox.stub(process.env, 'GITHUB_APP_IDENTIFIER').value('test app id');
    sandbox.stub(process.env, 'GITHUB_OWNER').value('test owner');
    processInstallationRepositories = sandbox.stub();
    generateReports = sandbox.stub();
    worker = proxyquire('../src/worker', {
      './github': github,
      './installation': processInstallationRepositories,
      './report': generateReports
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should audit each installation of the app', async function () {
    sandbox.stub(fs, 'readFileSync').returns('test key');
    sandbox.stub(github, 'getAppToken').resolves('test app token');
    const createWriter = sandbox.stub();
    const render = sandbox.stub();
    const testInstallations = [
      { repository_selection: 'all', account: { login: 'test installation one' } },
      { repository_selection: 'all', account: { login: 'test installation two' } }
    ];
    sandbox.stub(github, 'getInstallations').resolves(testInstallations);

    await worker(createWriter, render);

    sinon.assert.calledWith(github.getAppToken, 'test key', 'test app id');
    sinon.assert.calledWith(processInstallationRepositories, testInstallations[0], 'test owner', 'test app token');
    sinon.assert.calledWith(processInstallationRepositories, testInstallations[1], 'test owner', 'test app token');
    sinon.assert.calledWith(generateReports, 'test app id', 'test owner', [{
      installation: { account: { login: "test installation one" }, repository_selection: "all" },
      repositories: undefined
    }, {
      installation: { account: { login: "test installation two" }, repository_selection: "all" },
      repositories: undefined
    }]);
  });
});
