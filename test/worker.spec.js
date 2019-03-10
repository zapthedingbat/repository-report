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
    const mockartefacts = { test: 'artefact1' };
    const gather = sandbox.stub().resolves(mockartefacts);
    const mockAuditResults = ['test audit result'];
    const mockAuditDetails = ['test audit details'];
    const auditor = {
      getAuditResults: sandbox.stub().resolves(mockAuditResults),
      details: mockAuditDetails
    };
    const generateReport = sandbox.stub().resolves();
    const mockRepository = {};

    await worker([mockRepository], gather, auditor, generateReport);

    sinon.assert.calledWith(gather, mockRepository);
    sinon.assert.calledWith(generateReport, [{
      artefacts: { test: 'artefact1' },
      results: mockAuditResults
    }], mockAuditDetails);
  });
});
