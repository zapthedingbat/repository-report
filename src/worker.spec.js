const chai = require('chai');
const sinon = require('sinon');
const dotenv = require('dotenv');
const fs = require('fs');
const os = require('os');
const path = require('path');
const worker = require('./worker');
const workingDirectory = require('./working-directory');
const github = require('./github');

const expect = chai.expect

describe('Worker', function () {
  let sandbox;

  before(function () {
    sandbox = sinon.createSandbox();
  });

  beforeEach(function () {
    sandbox.mock(dotenv, 'config')
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

  it('should clone all repositories', async function () {
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

    const workingDirectoryPrepare = sandbox.stub(workingDirectory, 'prepare').returns('test working directory');
    const githubClone = sandbox.stub(github, 'clone').resolves();

    await worker();

    sinon.assert.calledWith(workingDirectoryPrepare, 'test login 1', 'test name 1');
    sinon.assert.calledWith(workingDirectoryPrepare, 'test login 2', 'test name 2');
    sinon.assert.calledWith(githubClone, 'test installation token', 'test clone url 1', 'test working directory');
    sinon.assert.calledWith(githubClone, 'test installation token', 'test clone url 2', 'test working directory');
  });

});
