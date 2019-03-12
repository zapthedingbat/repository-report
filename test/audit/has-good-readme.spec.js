const { expect } = require("chai");
const sinon = require("sinon");
const audit = require("../../src/audit/has-good-readme");

describe('Audit repository has a good readme file', function () {
  let sandbox;

  before(function () {
    sandbox = sinon.createSandbox();
  })
  
  afterEach(function () {
    sandbox.restore();
  })
  
  it('should have a title', async function () {
    expect(audit.details.title).to.equal('Has a helpful readme file');
  });
  
  it('should have a description', async function () {
    expect(audit.details.description).to.equal('Readme file should provide enough helpful information for someone to start using an contributing to the project.');
  });
  
  describe('getting results', function () {
    it('should fail when no readme file is present', function () {
      const result = audit.getResults({ });
      
      expect(result).to.eql({
        pass: false,
        score: 0,
        message: 'No readme file was found.'
      });
    });

    it('should fail when the readme file has too few headings', function () {
      const readmeContent = `word `.repeat(100);

      const result = audit.getResults({ readme: readmeContent });
      
      expect(result).to.eql({
        pass: false,
        score: 0,
        message: 'Readme has 0 headings and 100 other words.'
      });
    });
    
    it('should fail when the readme file has too few words', function () {
      const readmeContent = `# Heading\n`.repeat(100);
      
      const result = audit.getResults({ readme: readmeContent });
      
      expect(result).to.eql({
        pass: false,
        score: 0,
        message: 'Readme has 100 headings and 0 other words.'
      });
    });

    it('should succeed when the file has enough headings and words', function () {
      const wordContent = "word ".repeat(100);
      const headingContent = '# Heading \n' + wordContent + '\n';
      const readmeContent = headingContent.repeat(100);
      
      const result = audit.getResults({ readme: readmeContent });
      
      expect(result).to.eql({
        pass: true,
        score: 1,
        message: 'Readme has 100 headings and 10000 other words.'
      });
    });
  })
});
