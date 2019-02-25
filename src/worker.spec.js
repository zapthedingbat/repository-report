const chai = require('chai');
const sinon = require('sinon');
const dotenv = require('dotenv');
const fs = require('fs');
const proxyquire = require('proxyquire');

describe('Worker', function () {
  let sandbox;
  let github;
  let nodeDependencies;
  let worker;

  before(function () {
    sandbox = sinon.createSandbox();
    github = {
      getAppToken: sandbox.stub(),
      getInstallations: sandbox.stub(),
      getPaginated: sandbox.stub(),
      getTreeFiles: sandbox.stub(),
      getFileContents: sandbox.stub(),
      post: sandbox.stub(),
      get: sandbox.stub()
    };
    nodeDependencies = sandbox.stub();
    worker = proxyquire('./worker', {
      './github': github,
      './analyzers/node-dependencies': nodeDependencies
    });
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
    github.getInstallations.resolves([]);

    await worker();

    sinon.assert.calledWith(github.getAppToken, 'test key', 'test app id');
  });

  it('should get installations using the app token', async function () {
    sandbox.stub(fs, 'readFileSync').returns('test key');
    github.getAppToken.resolves('test app token');
    github.getInstallations.resolves([]);

    await worker();

    sinon.assert.calledWith(github.getInstallations, 'test app token');
  });

  it('should create a token for each installation', async function () {
    sandbox.stub(fs, 'readFileSync').returns('test key');
    github.getAppToken.resolves('test app token');
    github.getInstallations.resolves([
      {access_tokens_url: 'test access tokens url 1'},
      {access_tokens_url: 'test access tokens url 2'}
    ]);
    github.getPaginated.resolves([]);
    github.post.resolves({ token: 'test installation token' });
    github.get.resolves({repositories:[]});

    await worker();

    sinon.assert.calledWith(github.post, 'test app token', 'test access tokens url 1');
    sinon.assert.calledWith(github.post, 'test app token', 'test access tokens url 2');
  });

  it('should get repositories for each installation', async function () {
    sandbox.stub(fs, 'readFileSync').returns('test key');
    github.getAppToken.resolves('test app token');
    github.getInstallations.resolves([
      {
        access_tokens_url: 'test access tokens url 1',
        repositories_url: 'test repositories url 1'
      },
      {
        access_tokens_url: 'test repositories url 2',
        repositories_url: 'test repositories url 2'
      }
    ]);
    github.post.resolves({ token: 'test installation token' });
    github.getPaginated.resolves([
      {
        owner: { login: 'test owner' },
        name: 'test name',
        default_branch: 'test default_branch',
        fork: false,
        archived: false
      }
    ]);
    github.getTreeFiles.resolves({ tree: false });

    await worker();

    sinon.assert.calledTwice(github.getTreeFiles);
    sinon.assert.calledWith(github.getTreeFiles,
      'test installation token',
      'test owner',
      'test name',
      'test default_branch'
    );
  });

  it('should record node dependencies of repositories', async function () {
    sandbox.stub(fs, 'readFileSync').returns('test key');
    github.getAppToken.resolves('test app token');
    github.getInstallations.resolves([
      {
        access_tokens_url: 'test access tokens url 1',
        repositories_url: 'test repositories url 1'
      }
    ]);
    github.post.resolves({ token: 'test installation token' });
    github.getPaginated.resolves([{
      owner: { login: 'test owner' },
      fork: false,
      archived: false,
      full_name: 'test full_name'
    }]);
    github.getTreeFiles.resolves({
      tree: [
        { path: '/test/file-1' },
        { path: '/test/file-2' }
      ]
    });
    github.getFileContents.resolves({});
    nodeDependencies.resolves();

    await worker();

    sinon.assert.calledWith(nodeDependencies, ['/test/file-1', '/test/file-2'], sinon.match.func);
  });
});
