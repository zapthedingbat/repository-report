const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Audits', function () {
  let sandbox;
  let audits;
  let mockAudit;

  before(function () {
    sandbox = sinon.createSandbox();
    mockAudit = {
      name: 'test name',
      description: 'test description',
      audit: sandbox.stub().resolves('test result')
    };
    audits = proxyquire('./index', {
      './readme': {
        hasReadme: mockAudit,
        readmeLength: mockAudit,
        readmeStructure: mockAudit
      }
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should run audits and return the results', async function () {
    const mockAssets = {};
    const mockContext = {};
    
    const reports = await audits(mockAssets, mockContext);

    chai.expect(reports).to.eql([{
      name: 'test name',
      description: 'test description',
      result: 'test result'
    },
    {
      name: 'test name',
      description: 'test description',
      result: 'test result'
    },
    {
      name: 'test name',
      description: 'test description',
      result: 'test result'
    }]);
  });
});
