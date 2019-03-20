const { expect } = require('chai');
const sinon = require('sinon');
const builder = require('../../src/report/builder');

describe('Report builder', function () {
  it('should', async function () {
    const mockArtifacts = {};
    const gather = sinon.stub().resolves(mockArtifacts);
    const mockAuditResults = [ 'test audit result' ];
    const getAuditResults = sinon.stub().returns(mockAuditResults);
    const auditor = {
      details: 'test details',
      getAuditResults
    };
    const repositories = [ 'test repository' ];

    const actual = await builder(repositories, gather, auditor);

    sinon.assert.calledWithExactly(gather, repositories[0]);
    sinon.assert.calledWith(getAuditResults, mockArtifacts);
    expect(actual).to.eql({
      audits: auditor.details,
      results: [{
        artefacts: mockArtifacts,
        results: [ 'test audit result' ]
      }]
    });
  });
});
