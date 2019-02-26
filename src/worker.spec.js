const sinon = require('sinon');
const dotenv = require('dotenv');
const fs = require('fs');
const proxyquire = require('proxyquire');
const github = require('./github');

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
    worker = proxyquire('./worker', {
      './github': github,
      './installation': processInstallationRepositories
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('handle each process each installation of the app', async function () {
    sandbox.stub(fs, 'readFileSync').returns('test key');
    sandbox.stub(github, 'getAppToken').resolves('test app token');
    const testInstallations = ['test installation one', 'test installation two'];
    sandbox.stub(github, 'getInstallations').resolves(testInstallations);

    await worker();

    sinon.assert.calledWith(github.getAppToken, 'test key', 'test app id');
    sinon.assert.calledWith(processInstallationRepositories, 'test installation one', 'test owner', 'test app token');
  });
});
