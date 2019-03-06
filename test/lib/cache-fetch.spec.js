const chai = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const expect = chai.expect;

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

    beforeEach(function() {
      mockFs = {
        exists: sandbox.stub(),
        mkdirSync: sandbox.stub(),
        existsSync: sandbox.stub(),
        readFile: sandbox.stub(),
        writeFile: sandbox.stub()
      };
      nodeFetch = {
        ["default"]: sandbox.stub(),
        Response: sandbox.stub()
      };
      createCacheFetch = proxyquire("../../src/lib/cache-fetch", {
        fs: mockFs,
        util: { promisify: a => a },
        "node-fetch": nodeFetch
      });
    });

    it("should create the cache directory if it doesn't exist", function() {
      mockFs.existsSync.returns(false);

      createCacheFetch("test path");

      sinon.assert.calledWith(mockFs.mkdirSync, "test path");
    });

    it("should not create the cache directory if it already exist", async function() {
      mockFs.existsSync.returns(true);

      createCacheFetch("test path");

      sinon.assert.notCalled(mockFs.mkdirSync);
    });

    describe("cached fetch", function() {
      let cacheFetch;

      beforeEach(function() {
        cacheFetch = createCacheFetch("test cache dir");
      });

      it("should write successful results to the file system", async function() {
        nodeFetch.default.resolves({
          status: 200,
          statusText: "test status text",
          headers: { raw: sandbox.mock().returns("test headers") },
          text: sandbox.mock().returns("text body")
        });
        mockFs.exists.resolves(false);
        mockFs.writeFile.resolves();

        await cacheFetch("test url");

        sinon.assert.calledWith(
          mockFs.writeFile,
          sinon.match.string,
          `{"init":{"status":200,"statusText":"test status text","headers":"test headers"},"body":"text body"}`
        );
      });

      it("should not write unsuccessful results to the file system", async function() {
        nodeFetch.default.resolves({
          status: 500,
          statusText: "test status text",
          headers: { raw: sandbox.mock().returns("test headers") },
          text: sandbox.mock().returns("test body")
        });
        const mockResponse = {};
        nodeFetch.Response.returns(mockResponse);
        mockFs.exists.resolves(false);
        mockFs.writeFile.resolves();

        const result = await cacheFetch("test url");

        sinon.assert.calledWith(nodeFetch.Response, "test body", {
          headers: "test headers",
          status: 500,
          statusText: "test status text"
        });
        expect(result).to.equal(mockResponse);
      });

      it("should return the result from the file system", async function() {
        mockFs.exists.resolves(true);
        mockFs.readFile.resolves('{"body":"test body", "init": "test init"}');

        const mockResponse = {};
        nodeFetch.Response.returns(mockResponse);
        const result = await cacheFetch("test url");

        sinon.assert.calledWith(nodeFetch.Response, "test body", "test init");
        expect(result).to.equal(mockResponse);
      });
    });
  });
});
