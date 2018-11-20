const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const expect = chai.expect;

describe('GitHub', function () {
  let sandbox;
  let github;

  before(function () {
    sandbox = sinon.createSandbox();
  });
  
  afterEach(function () {
    sandbox.restore();
  });

  describe('Clone', function () {
    let nodegit;

    beforeEach(function () {
      nodegit = {
        Clone: sinon.stub(),
        Cred: {
          userpassPlaintextNew: sinon.stub()
        }
      }
      github = proxyquire('./github', {
        'nodegit': nodegit
      })
    })

    it('should git-clone the repository with the specified token', async function () {
      github.clone('test token', 'test url', 'test working directory');
      
      sinon.assert.calledWithExactly(nodegit.Clone, 'test url', 'test working directory', sinon.match({
        fetchOpts: {
          callbacks: {
            credentials: sinon.match.func
          }
        }
      }));
    });

    it('should git-clone with the token credentials', async function () {
      const testCredentials = {};
      nodegit.Cred.userpassPlaintextNew.returns(testCredentials);
      
      github.clone('test token', 'test url', 'test working directory');

      const fetchOptsCallbacks = nodegit.Clone.lastCall.args[2].fetchOpts.callbacks;
      const certificateCheckCallback = fetchOptsCallbacks.certificateCheck;
      const credentialsCallback = fetchOptsCallbacks.credentials;
      const certificateCheck = certificateCheckCallback();
      const credentials = credentialsCallback();
      sinon.assert.calledWithExactly(nodegit.Cred.userpassPlaintextNew, 'x-access-token', 'test token');
      expect(certificateCheck).to.equal(1);
      expect(credentials).to.equal(testCredentials);
    });
  });

  describe('Get', function () {
    let nodeFetch;

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
