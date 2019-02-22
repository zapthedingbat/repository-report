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
    sandbox.stub(dotenv, 'config');
    process.env.GITHUB_APP_IDENTIFIER = '';
    process.env.GITHUB_OWNER = ''
    sandbox.stub(process.env, 'GITHUB_APP_IDENTIFIER').value('test app id');
    sandbox.stub(process.env, 'GITHUB_OWNER').value('test owner');
  });
  
  afterEach(function () {
    sandbox.restore();
  });

  it('should generate an application token using app id and key', async function () {
    sandbox.stub(fs, 'readFileSync').returns('test key');

    const getAppToken = sandbox.stub(github, 'getAppToken');
    sandbox.stub(github, 'getInstallations').resolves([]);

    await worker();

    sinon.assert.calledWith(getAppToken, 'test key', 'test app id');
  });

  it('should get installations using the app token', async function () {
    sandbox.stub(fs, 'readFileSync').returns('test key');
    sandbox.stub(github, 'getAppToken').resolves('test app token');
    const getInstallations = sandbox.stub(github, 'getInstallations').resolves([]);

    await worker();

    sinon.assert.calledWith(getInstallations, 'test app token');
  });

  it('should create a token for each installation', async function () {
    sandbox.stub(fs, 'readFileSync').returns('test key');
    sandbox.stub(github, 'getAppToken').resolves('test app token');
    sandbox.stub(github, 'getInstallations').resolves([
      {access_tokens_url: 'test access tokens url 1'},
      {access_tokens_url: 'test access tokens url 2'}
    ]);
    sandbox.stub(github, 'getPaginated').resolves([]);
    const githubPost = sandbox.stub(github, 'post').resolves({ token: 'test installation token' });
    sandbox.stub(github, 'get').resolves({repositories:[]});

    await worker();

    sinon.assert.calledWith(githubPost, 'test app token', 'test access tokens url 1');
    sinon.assert.calledWith(githubPost, 'test app token', 'test access tokens url 2');
  });

  it('should get repositories for each installation', async function () {
    sandbox.stub(fs, 'readFileSync').returns('test key');
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
    sandbox.stub(github, 'getPaginated').resolves([
      {
        owner: { login: 'test owner' },
        name: 'test name',
        default_branch: 'test default_branch',
        fork: false,
        archived: false
      }
    ]);
    sandbox.stub(github, 'getTreeFiles').resolves({ tree: false });

    await worker();

    sinon.assert.calledTwice(github.getTreeFiles);
    sinon.assert.calledWith(github.getTreeFiles,
      'test installation token',
      'test owner',
      'test name',
      'test default_branch'
    );
  });

  it('should analyze repositories', async function () {
    sandbox.stub(fs, 'readFileSync').returns('test key');
    sandbox.stub(github, 'getAppToken').resolves('test app token');
    sandbox.stub(github, 'getInstallations').resolves([
      {
        access_tokens_url: 'test access tokens url 1',
        repositories_url: 'test repositories url 1'
      }
    ]);
    sandbox.stub(github, 'post').resolves({ token: 'test installation token' });
    sandbox.stub(github, 'getPaginated').resolves([{
      owner: { login: 'test owner' },
      fork: false,
      archived: false,
      full_name: 'test full_name'
    }]);
    sandbox.stub(github, 'getTreeFiles').resolves({
      tree: [
        { path: '/test/file-1' },
        { path: '/test/file-2' }
      ]
    });
    sandbox.stub(github, 'getFileContents').resolves({});
    const analyzeDependencies = sandbox.stub(analyzer, 'analyzeDependencies').resolves();

    await worker();

    sinon.assert.calledWith(analyzeDependencies, sinon.match.object, 'test full_name', ['/test/file-1', '/test/file-2'], sinon.match.func);
  });
});
