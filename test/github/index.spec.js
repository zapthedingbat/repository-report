const chai = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const expect = chai.expect;

describe("GitHub", function() {
  let sandbox;
  let fetch;
  let github;
  let jsonwebtoken;

  before(function() {
    sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    childProcess = { spawn: sandbox.stub() };
    fetch = sandbox.stub().returns({
      json: sandbox.stub().resolves()
    });
    const createCacheFetch = () => fetch;
    jsonwebtoken = {
      sign: sandbox.stub()
    };
    github = proxyquire("../../src/github/index", {
      "./../cache-fetch": createCacheFetch,
      jsonwebtoken: jsonwebtoken
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe("Get", function() {
    it("should get the given url with the authorization headers", async function() {
      await github.get("test token", "test url");

      sinon.assert.calledWithExactly(fetch, "test url", {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.machine-man-preview+json",
          Authorization: "Bearer test token"
        }
      });
    });
  });

  describe("Get Installations", function() {
    it("should get the installations url with the authorization headers", async function() {
      github.getInstallations("test token");

      sinon.assert.calledWithExactly(
        fetch,
        "https://api.github.com/app/installations",
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github.machine-man-preview+json",
            Authorization: "Bearer test token"
          }
        }
      );
    });
  });

  describe("Get Paginated", function() {
    it("should get paginated results with the authorization headers", async function() {
      const mockGetItems = sandbox.stub().returns(["test item"]);
      const mockHeaders = {
        get: sinon
          .stub()
          .onCall(0)
          .returns('<page two>; rel="next"')
          .onCall(1)
          .returns("test link header") // no more pages
      };
      fetch.returns({
        headers: mockHeaders,
        json: sinon.stub().resolves()
      });

      await github.getPaginated("test token", "test url", mockGetItems);

      sinon.assert.calledWithExactly(mockHeaders.get, "link");
      sinon.assert.calledWithExactly(fetch, "test url", {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.machine-man-preview+json",
          Authorization: "Bearer test token"
        }
      });
      sinon.assert.calledWithExactly(fetch, "page two", {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.machine-man-preview+json",
          Authorization: "Bearer test token"
        }
      });
    });
  });

  describe("Get Tree Files", function() {
    it("should get the tree files", async function() {
      fetch.returns({
        json: sinon.stub().resolves({})
      });

      await github.getTreeFiles(
        "test token",
        "test owner",
        "test repo",
        "test branch"
      );

      sinon.assert.calledWithExactly(
        fetch,
        "https://api.github.com/repos/test owner/test repo/git/trees/test branch?recursive=1",
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github.machine-man-preview+json",
            Authorization: "Bearer test token"
          }
        }
      );
    });
  });

  describe("Get File Contents", function() {
    beforeEach(function() {
      fetch.returns({
        json: sinon.stub().resolves({
          content: "dGVzdA=="
        })
      });
    });

    it("should get the file contents", async function() {
      const actual = await github.readFile(
        "test token",
        "test owner",
        "test repo",
        "test branch",
        "test/path"
      );

      expect(actual).to.equal("test");
      sinon.assert.calledWithExactly(
        fetch,
        "https://api.github.com/repos/test owner/test repo/contents/test%2Fpath?ref=test branch",
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github.machine-man-preview+json",
            Authorization: "Bearer test token"
          }
        }
      );
    });
  });

  describe("Get App Token", function() {
    it("should create a JWT with the given key and appId", async function() {
      await github.getAppToken("test key", "test app id");

      sinon.assert.calledWithExactly(
        jsonwebtoken.sign,
        { iss: "test app id" },
        "test key",
        { algorithm: "RS256", expiresIn: "5m" }
      );
    });
  });

  describe("Post", function() {
    it("should post the given url with the authorization headers", async function() {
      github.post("test token", "test url");

      sinon.assert.calledWithExactly(fetch, "test url", {
        method: "POST",
        headers: {
          Accept: "application/vnd.github.machine-man-preview+json",
          Authorization: "Bearer test token"
        }
      });
    });
  });
});
