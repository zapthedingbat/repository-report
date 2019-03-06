const sinon = require("sinon");
const worker = require("../src/worker");

describe("Worker", function() {
  let sandbox;

  before(function() {
    sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should gather assets and audit each repository", async function() {
    const mockArtifacts = { test: 'artifact1' };
    const gather = sandbox.stub().resolves(mockArtifacts);
    const mockAuditResults = [ 'test audit result' ];
    const auditor = { audit: sandbox.stub().resolves(mockAuditResults) };
    const generateReport = sandbox.stub().resolves();
    const mockRepository = {};

    await worker([mockRepository], gather, auditor, generateReport);

    sinon.assert.calledWith(gather, mockRepository);
    sinon.assert.calledWith(generateReport, [{
      artifacts: { test: 'artifact1' },
      results: mockAuditResults
    }]);
  });
});
