const { expect } = require("chai");
const audit = require("../../src/audit/has-many-contributors");

describe('Audit has many contributors', function () {
  
  it('should have a title', async function () {
    expect(audit.details.title).to.equal('Has more than one contributor');
  });
  
  it('should have a description', async function () {
    expect(audit.details.description).to.equal('Projects are strongest when they are a collaborative effort.');
  });
  
  describe('getting results', function () {
    it('should fail when there is less two one contributors', function () {
      const result = audit.getResults({ "contributors": [] });
      
      expect(result).to.eql({
        pass: false,
        score: 0,
        message: 'There are no contributors'
      });
    });

    it('should succeed when there more than one contributor', function () {
      const result = audit.getResults({ "contributors": [{}, {}, {}] });
      
      expect(result).to.eql({
        pass: true,
        score: 1,
        message: 'There are 3 contributors'
      });
    });

    it('should indicate the number of contributors', function () {
      const result = audit.getResults({
        "contributors": [{}]
      });
      
      expect(result).to.eql({
        pass: false,
        score: 0,
        message: 'There is only one contributor'
      });
    });
  })
});
