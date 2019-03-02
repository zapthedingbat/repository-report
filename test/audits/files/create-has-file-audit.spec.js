const chai = require('chai');
const createHasFileAudit = require('../../../src/audits/files/create-has-file-audit');

describe('Create has-file audit', function () {
  let hasFileAudit;

  before(function () {
    hasFileAudit = createHasFileAudit('test name', 'test description', /test\.pattern/);
  });

  describe('name', function () {
    it('should have a name', function () {
      chai.expect(hasFileAudit.name).to.equal('test name');
    });
  });

  describe('description', function () {
    it('should have a description', function () {
      chai.expect(hasFileAudit.description).to.equal('test description');
    });
  });

  describe('audit', function () {
    it('should return a score of 0 when file not is present', async function () {
      const result = await hasFileAudit.audit({
        filePaths: ['a', 'b', 'c']
      }, {});

      chai.expect(result).to.eql({ score: 0 });
    });

    it('should return a score of 1 when file is present', async function () {
      const result = await hasFileAudit.audit({
        filePaths: ['a', 'test.pattern', 'c']
      }, {});
      
      chai.expect(result).to.eql({ score: 1 });
    });
  });
});
