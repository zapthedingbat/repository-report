const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe('Audit repository was created after 30 days', function () {
  let sandbox;
  let audit;
  let mockCreateAfterDaysAudit;
  let mockAfterDaysAudit;

  before(function () {
    sandbox = sinon.createSandbox();
    mockAfterDaysAudit = {};
    mockCreateAfterDaysAudit = sandbox.stub().returns(mockAfterDaysAudit)
    audit = proxyquire("../../src/audit/created-after-30-days", {
      "../../src/lib/create-after-days-audit": mockCreateAfterDaysAudit
    })
  })
  
  afterEach(function () {
    sandbox.restore();
  })

  describe('create audit', function () {
    let args;
 
    before(function () {
      args = mockCreateAfterDaysAudit.lastCall.args;
    });

    it('should create an after days audit', async function () {
      expect(audit).to.equal(mockAfterDaysAudit);
    });

    it('should set the title', function () {
      expect(args[0]).to.equal('Repository was created more than 30 days ago.');
    });

    it('should set the description', function () {
      expect(args[1]).to.equal('Projects often take time to reach maturity. The ongoing stewardship of a project can be as difficult then it\'s creation. Try to stay focused on reaching a clear and realistic milestone early.');
    });

    it('should set number of days to 30', function () {
      expect(args[2]).to.equal(30);
    });

    it('should use the repository createdAt property', function () {
      const fn = args[3];
      const actual = fn({ repository: { createdAt: 'test created at' } });
      expect(actual).to.equal('test created at');
    });

    describe('generate message', function () {
      let messageFn;

      before(function () {
        messageFn = args[4];
      })

      it('should indicate if the repository was created today', async function () {
        const actual = messageFn(true, 0);
        expect(actual).to.equal('Repository was created today!');
      });
      
      it('should indicate if the repository was created yesterday', async function () {
        const actual = messageFn(true, 1);
        expect(actual).to.equal('Repository was created yesterday!');
      });
      it('should indicate if the repository was created less than 30 days ago', async function () {
        const actual = messageFn(true, 3);
        expect(actual).to.equal('Repository was only created 3 days ago.');
      });
      it('should indicate if the repository was created more than than 30 days ago', async function () {
        const actual = messageFn(false, 31);
        expect(actual).to.equal('Repository was created 31 days ago.');
      });
    });
  });
});
