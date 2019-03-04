const sinon = require("sinon");
const chai = require("chai");
const snapshot = require("../support/snapshot");
const html = require("../../src/report/html");

const expect = chai.expect;

describe("Report HTML", function() {
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
    const generate = html(createWrite, "test app id", "test owner");
    await generate([
      {
        installation: {
          account: { login: "test login" }
        },
        repositories: []
      }
    ]);

    snapshot("./test/report/html.snapshot", write.lastCall.args[0]);
  });
});
