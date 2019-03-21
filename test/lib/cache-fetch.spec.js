const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const path = require('path');

describe("Cache fetch", function() {
  let sandbox;

  before(function() {
    sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe("Create", function() {
    let createCacheFetch;
    let mockFs;
    let nodeFetch;
    let getHash;
    let cachePredicate;

    beforeEach(function () {
      this.timeout = 30000;
      mockFs = {
        exists: sandbox.stub(),
        mkdirSync: sandbox.stub(),
        existsSync: sandbox.stub(),
        readFile: sandbox.stub(),
        writeFile: sandbox.stub()
      };
      nodeFetch = {
        "default": sandbox.stub(),
        "Response": sandbox.stub()
      };
      createCacheFetch = proxyquire("../../src/lib/cache-fetch", {
        "fs": mockFs,
        "util": { promisify: a => a },
        "node-fetch": nodeFetch
      });
      getHash = sandbox.stub();
      cachePredicate = sandbox.stub();
    });

    it("should create the cache directory if it doesn't exist", function() {
      mockFs.existsSync.returns(false);

      createCacheFetch("test path", getHash, cachePredicate);

      sinon.assert.calledWith(mockFs.mkdirSync, "test path");
    });

    it("should not create the cache directory if it already exist", async function() {
      mockFs.existsSync.returns(true);

      createCacheFetch("test path", getHash, cachePredicate);

      sinon.assert.notCalled(mockFs.mkdirSync);
    });

    describe("cached fetch", function() {
      let cacheFetch;

      beforeEach(function () {
        cacheFetch = createCacheFetch("test cache dir", getHash, cachePredicate);
      });

      it("should write successful results to the file system", async function() {
        nodeFetch.default.resolves({
          status: 200,
          statusText: "test status text",
          headers: { raw: sandbox.mock().returns("test headers") },
          text: sandbox.mock().resolves("text body")
        });
        mockFs.exists.resolves(false);
        mockFs.writeFile.resolves();
        getHash.returns('testhash');
        cachePredicate.returns(true);

        await cacheFetch("test url");

        sinon.assert.calledWith(cachePredicate, "test url");
        sinon.assert.calledWith(
          mockFs.writeFile,
          `test cache dir${path.sep}testhash`,
          `{"init":{"status":200,"statusText":"test status text","headers":"test headers"},"body":"text body"}`
        );
      });

      it("should not write unsuccessful results to the file system", async function() {
        nodeFetch.default.resolves({
          status: 500,
          statusText: "test status text",
          headers: { raw: sandbox.mock().returns("test headers") },
          text: sandbox.mock().resolves("test body")
        });
        const mockResponse = {};
        nodeFetch.Response.returns(mockResponse);
        mockFs.exists.resolves(false);
        mockFs.writeFile.resolves();
        getHash.returns('testhash');
        cachePredicate.returns(true);

        const result = await cacheFetch("test url");

        sinon.assert.calledWith(nodeFetch.Response, "test body", {
          headers: "test headers",
          status: 500,
          statusText: "test status text"
        });
        expect(result).to.equal(mockResponse);
      });

      it("should return the result from the file system when the predicate matches", async function() {
        mockFs.exists.resolves(true);
        mockFs.readFile.resolves('{"body":"test body", "init": "test init"}');
        const mockResponse = {};
        nodeFetch.Response.returns(mockResponse);
        getHash.returns('testhash');
        cachePredicate.returns(true);

        const result = await cacheFetch("test url");

        sinon.assert.calledWith(nodeFetch.Response, "test body", "test init");
        expect(result).to.equal(mockResponse);
      });

      it("should not return the result from the file system when the predicate doesn\'t match", async function() {
        nodeFetch.default.resolves({
          status: 200,
          statusText: "test status text",
          headers: { raw: sandbox.mock().returns("test headers") },
          text: sandbox.mock().resolves("text body")
        });
        mockFs.exists.resolves(false);
        mockFs.writeFile.resolves();
        getHash.returns('testhash');
        cachePredicate.returns(true);

        await cacheFetch("test url");

        sinon.assert.called(mockFs.writeFile)
      });
    });
  });
});
