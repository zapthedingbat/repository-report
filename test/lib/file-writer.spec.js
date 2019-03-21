const sinon = require("sinon");
const fs = require("fs");
const path = require("path");
const createWriter = require("../../src/lib/file-writer");

describe("File writer", function() {
  let sandbox;

  before(function() {
    sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe("Create Writer", function() {
    describe("Writer", function () {
      it("should return a function that writes to a file in the specified directory", async function () {
        const mockStream = {
          write: sandbox.stub().yields()
        };
        sandbox.stub(fs, "createWriteStream").returns(mockStream);
        sandbox.stub(path, "join").returns("mock path");
        const writer = createWriter("test directory");

        await writer("test report name", "test data", "test renderer name");

        sinon.assert.calledWith(path.join, "test directory", "test report name.test renderer name");
        sinon.assert.calledWith(fs.createWriteStream, "mock path");
        sinon.assert.calledWith(mockStream.write, "test data");
      });
    });
  });
});
