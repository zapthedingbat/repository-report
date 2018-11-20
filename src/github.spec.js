const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { EventEmitter } = require('events');
const expect = chai.expect;

describe('GitHub', function () {
  let sandbox;
  
  before(function () {
    sandbox = sinon.createSandbox();
  });
  
  afterEach(function () {
    sandbox.restore();
  });
  
  describe('Clone', function () {
    let childProcess;
    let github;

    beforeEach(function () {
      childProcess = { spawn: sandbox.stub() };
      github = proxyquire('./github', {
        'child_process': childProcess
      });
    })

    it('should git-clone the repository with the specified token', async function () {
      const testProcess = new EventEmitter();
      childProcess.spawn.returns(testProcess);
      
      const clonePromise = github.clone('test-token', 'http://test/url', 'test working directory');
      testProcess.emit('close', 0);
      await clonePromise;

      sinon.assert.calledWithExactly(childProcess.spawn, 'git', ["clone", "http://x-access-token:test-token@test/url", "test working directory"]);
    });
  });

  describe('Get', function () {
    let nodeFetch;
    let github;

    beforeEach(function () {
      nodeFetch = sinon.stub()
        .returns({ json: sinon.stub().resolves() });
      github = proxyquire('./github', {
        'node-fetch': nodeFetch
      });
    })

    it('should get the given url with the authorization headers', async function () {
      github.get('test token', 'test url');
      
      sinon.assert.calledWithExactly(nodeFetch, 'test url', {
        headers: {
          Accept: "application/vnd.github.machine-man-preview+json",
          Authorization: "Bearer test token"
        }
      });
    });
  });

  describe('Get Installations', function () {
    let nodeFetch;
    let github;

    beforeEach(function () {
      nodeFetch = sinon.stub()
        .returns({ json: sinon.stub().resolves() });
      github = proxyquire('./github', {
        'node-fetch': nodeFetch
      });
    })

    it('should get the installations url with the authorization headers', async function () {
      github.getInstallations('test token');
      
      sinon.assert.calledWithExactly(nodeFetch, 'https://api.github.com/app/installations', {
        headers: {
          Accept: "application/vnd.github.machine-man-preview+json",
          Authorization: "Bearer test token"
        }
      });
    });
  });

  describe('Get Tree Files', function () {
    let nodeFetch;
    let github;

    beforeEach(function () {
      nodeFetch = sinon.stub()
        .returns({ json: sinon.stub().resolves() });
      github = proxyquire('./github', {
        'node-fetch': nodeFetch
      });
    })

    it('should get the tree files', async function () {
      github.getTreeFiles('test token', 'test owner', 'test repo', 'test branch');
      
      sinon.assert.calledWithExactly(nodeFetch, 'https://api.github.com/repos/test owner/test repo/git/trees/test branch?recursive=1', {
        headers: {
          Accept: "application/vnd.github.machine-man-preview+json",
          Authorization: "Bearer test token"
        }
      });
    });
  })

  describe('Get File Contents', function () {
    let nodeFetch;
    let github;

    beforeEach(function () {
      nodeFetch = sinon.stub()
        .returns({
          json: sinon.stub().resolves({
            content: "dGVzdA=="
          })
        });
      github = proxyquire('./github', {
        'node-fetch': nodeFetch
      });
    })

    it('should get the file contents', async function () {
      const actual = await github.getFileContents('test token', 'test owner', 'test repo', 'test branch', 'test/path');
      
      expect(actual).to.equal('test');
      sinon.assert.calledWithExactly(nodeFetch, 'https://api.github.com/repos/test owner/test repo/contents/test%2Fpath?ref=test branch', {
        headers: {
          Accept: "application/vnd.github.machine-man-preview+json",
          Authorization: "Bearer test token"
        }
      });
    });
  });

  describe('Get App Token', function () {
    let jsonwebtoken;

    beforeEach(function () {
      jsonwebtoken = {
        sign: sinon.stub()
      }
      github = proxyquire('./github', {
        'jsonwebtoken': jsonwebtoken
      });
    })

    it('should create a JWT with the given key and appId', async function () {
      github.getAppToken('test key', 'test app id');
      
      sinon.assert.calledWithExactly(jsonwebtoken.sign, { iss: 'test app id' }, 'test key', { algorithm: 'RS256', expiresIn: '5m' });
    });
  });

  describe('Post', function () {
    let nodeFetch;

    beforeEach(function () {
      nodeFetch = sinon.stub()
        .returns({ json: sinon.stub().resolves() });
      github = proxyquire('./github', {
        'node-fetch': nodeFetch
      });
    })

    it('should post the given url with the authorization headers', async function () {
      github.post('test token', 'test url');
      
      sinon.assert.calledWithExactly(nodeFetch, 'test url', {
        method: 'POST',
        headers: {
          Accept: "application/vnd.github.machine-man-preview+json",
          Authorization: "Bearer test token"
        }
      });
    });
  });
});
