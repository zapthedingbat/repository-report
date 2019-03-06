const chai = require("chai");
const sinon = require("sinon");
const createAuditor = require("../../src/auditor");

describe('auditor', function () {
  it('should execute each audit', async function () {
    const mockArtefacts = {
      test: true
    }

    const auditor = createAuditor();

    const actual = await auditor.getAuditResults(mockArtefacts);

    chai.expect(actual).to.eql({
      one: '1',
      two: '2'
    });
  });

  it('should return details of each audit', async function () {

    const auditor = createAuditor();

    chai.expect(auditor.details).to.eql([{}, {}]);
  })
})
