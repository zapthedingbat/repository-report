const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe('Audit repository was pushed within a year', function () {
  let sandbox;
  let audit;
  let mockCreateWithinDaysAudit;
  let mockWithinDaysAudit;

  before(function () {
    sandbox = sinon.createSandbox();
    mockWithinDaysAudit = {};
    mockCreateWithinDaysAudit = sandbox.stub().returns(mockWithinDaysAudit)
    audit = proxyquire("../../src/audit/pushed-within-a-year", {
      "../../src/lib/create-within-days-audit": mockCreateWithinDaysAudit
    })
  })
  
  afterEach(function () {
    sandbox.restore();
  })

  describe('create audit', function () {
    let args;
    let messageFn;

    before(function () {
      args = mockCreateWithinDaysAudit.lastCall.args;
      messageFn = args[4];
    })

    it('should create an within days audit', async function () {
      expect(audit).to.equal(mockWithinDaysAudit);
    });

    it('should set the title', function () {
      expect(args[0]).to.equal('Code was pushed within a year');
    });

    it('should set the description', function () {
      expect(args[1]).to.equal('Repositories should be actively maintained.');
    });

    it('should set number of days to 365', function () {
      expect(args[2]).to.equal(365);
    });

    it('should use the repository pushedAt property', function () {
      const fn = args[3];
      const actual = fn({ repository: { pushedAt: 'test pushed at' } });
      expect(actual).to.equal('test pushed at');
    });

    it('should indicate when the repository was pushed to', async function () {
      const actual = messageFn(true, 123);
      expect(actual).to.equal('Repository was pushed to 123 days ago.');
    });
  });
});
