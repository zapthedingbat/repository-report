const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe('Audit repository was created within a year', function () {
  let sandbox;
  let audit;
  let mockCreateWithinDaysAudit;
  let mockWithinDaysAudit;

  before(function () {
    sandbox = sinon.createSandbox();
    mockWithinDaysAudit = {};
    mockCreateWithinDaysAudit = sandbox.stub().returns(mockWithinDaysAudit)
    audit = proxyquire("../../src/audit/created-within-a-year", {
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
      expect(args[0]).to.equal('Repository is less than a year old');
    });

    it('should set the description', function () {
      expect(args[1]).to.equal('The project has been around for a while.');
    });

    it('should set number of days to 365', function () {
      expect(args[2]).to.equal(365);
    });

    it('should use the repository createdAt property', function () {
      const fn = args[3];
      const actual = fn({ repository: { createdAt: 'test created at' } });
      expect(actual).to.equal('test created at');
    });

    it('should indicate when the repository was created', async function () {
      const actual = messageFn(true, 123);
      expect(actual).to.equal('Repository was created 123 days ago.');
    });
  });
});
