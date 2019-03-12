const sinon = require("sinon");
const chai = require("chai");
const snapshot = require("../../test-support/snapshot");
const json = require("../../src/render/json");

const expect = chai.expect;

describe("Report JSON", function() {
  let sandbox;

  before(function() {
    sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should render a report to the given writer", async function() {
    const write = sandbox.stub();
    const createWrite = sandbox.stub().returns(write);
    const generate = json(createWrite, "test app id", "test owner");
    await generate([
      {
        document: { title: 'test title' },
        installation: {},
        results: []
      }
    ]);

    snapshot("./test/report/json.snapshot", write.lastCall.args[0]);
  });
});
