const chai = require('chai');
const sinon = require('sinon');
const dotenv = require('dotenv');
const fs = require('fs');
const github = require('./github');
const analyzer = require('./analyzer');
const worker = require('./worker');

const expect = chai.expect

describe('Worker', function () {
  let sandbox;

  before(function () {
    sandbox = sinon.createSandbox();
  });

  beforeEach(function () {
    sandbox.stub(dotenv, 'config')
    process.env.GITHUB_APP_IDENTIFIER = 'test app id';
  });
  
  afterEach(function () {
    sandbox.restore();
  });

  it('should generate an application token using app id and key', async function () {
    sandbox.stub(fs, 'readFileSync').returns('test key');
    sandbox.stub(process.env, 'GITHUB_APP_IDENTIFIER').value('test app id');
    const getAppToken = sandbox.stub(github, 'getAppToken');
    sandbox.stub(github, 'getInstallations').resolves([]);

    await worker();

    sinon.assert.calledWith(getAppToken, 'test key', 'test app id');
  });

  it('should get installations using the app token', async function () {
    sandbox.stub(fs, 'readFileSync').returns('test key');
    sandbox.stub(process.env, 'GITHUB_APP_IDENTIFIER').value('test app id');
    sandbox.stub(github, 'getAppToken').resolves('test app token');
    const getInstallations = sandbox.stub(github, 'getInstallations').resolves([]);

    await worker();

    sinon.assert.calledWith(getInstallations, 'test app token');
  });

  it('should create a token for each installation', async function () {
    sandbox.stub(fs, 'readFileSync').returns('test key');
    sandbox.stub(process.env, 'GITHUB_APP_IDENTIFIER').value('test app id');
    sandbox.stub(github, 'getAppToken').resolves('test app token');
    sandbox.stub(github, 'getInstallations').resolves([
      {access_tokens_url: 'test access tokens url 1'},
      {access_tokens_url: 'test access tokens url 2'}
    ]);
    const githubPost = sandbox.stub(github, 'post').resolves({ token: 'test installation token' });
    sandbox.stub(github, 'get').resolves({repositories:[]});

    await worker();

    sinon.assert.calledWith(githubPost, 'test app token', 'test access tokens url 1');
    sinon.assert.calledWith(githubPost, 'test app token', 'test access tokens url 2');
  });

  it('should get repositories for each installation', async function () {
    sandbox.stub(fs, 'readFileSync').returns('test key');
    sandbox.stub(process.env, 'GITHUB_APP_IDENTIFIER').value('test app id');
    sandbox.stub(github, 'getAppToken').resolves('test app token');
    sandbox.stub(github, 'getInstallations').resolves([
      {
        access_tokens_url: 'test access tokens url 1',
        repositories_url: 'test repositories url 1'
      },
      {
        access_tokens_url: 'test repositories url 2',
        repositories_url: 'test repositories url 2'
      }
    ]);
    sandbox.stub(github, 'post').resolves({ token: 'test installation token' });
    const githubGet = sandbox.stub(github, 'get').resolves({ repositories: [] });

    await worker();

    sinon.assert.calledWith(githubGet, 'test installation token', 'test repositories url 1');
    sinon.assert.calledWith(githubGet, 'test installation token', 'test repositories url 2');
  });

  it('should analyze all repositories', async function () {
    sandbox.stub(fs, 'readFileSync').returns('test key');
    sandbox.stub(process.env, 'GITHUB_APP_IDENTIFIER').value('test app id');
    sandbox.stub(github, 'getAppToken').resolves('test app token');
    sandbox.stub(github, 'getInstallations').resolves([
      {
        access_tokens_url: 'test access tokens url 1',
        repositories_url: 'test repositories url 1'
      }
    ]);
    sandbox.stub(github, 'post').resolves({ token: 'test installation token' });
    sandbox.stub(github, 'get').resolves({
      repositories: [
        {
          name: 'test name 1',
          clone_url: 'test clone url 1',
          owner: { login: 'test login 1'}
        },
        {
          name: 'test name 2',
          clone_url: 'test clone url 2',
          owner: { login: 'test login 2'}
        }
      ]
    });
    sandbox.stub(github, 'getTreeFiles').resolves({    
      tree: [
        { path: '/test/file-1' },
        { path: '/test/file-2' }
      ]
    });
    sandbox.stub(github, 'getFileContents').resolves({});
    const analyzerAnalyze = sandbox.stub(analyzer, 'analyze').resolves();

    await worker();

    sinon.assert.calledWith(analyzerAnalyze, ['/test/file-1', '/test/file-2'], sinon.match.func);
  });
});
