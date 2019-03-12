const { expect } = require("chai");
const audit = require("../../src/audit/has-link-from-confluence");

describe.only('Audit link from confluence', function () {
  
  it('should have a title', async function () {
    expect(audit.details.title).to.equal('Is linked to from confluence');
  });
  
  it('should have a description', async function () {
    expect(audit.details.description).to.equal('A runbook should link to the repository.');
  });
  
  describe('getting results', function () {
    it('should fail when no confluence link is present', function () {
      const result = audit.getResults({ "confluence-linked-pages": [] });
      
      expect(result).to.eql({
        pass: false,
        score: 0,
        message: 'There are no links from confluence'
      });
    });

    it('should succeed when there is a link from confluence', function () {
      const result = audit.getResults({ "confluence-linked-pages": [{ title: 'a link' }] });
      
      expect(result).to.eql({
        pass: true,
        score: 1,
        message: 'There is a link from confluence'
      });
    });

    it('should indicate the number of links from confluence', function () {
      const result = audit.getResults({
        "confluence-linked-pages": [ {}, {}, {} ]
      });
      
      expect(result).to.eql({
        pass: true,
        score: 1,
        message: 'There are 3 links from confluence'
      });
    });
  })
});
