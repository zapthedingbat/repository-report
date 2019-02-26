const chai = require('chai');
const hasReadme = require('./has-readme');

describe('Has Readme', function () {
  describe('description', function () {
    it('should have a description', function () {
      chai.expect(hasReadme.description).to.equal('Project should have a readme file. A Readme file is a way for other users to learn about the project.');
    });
  });

  describe('audit', function () {
    it('should return a score of 0 when readme not is present', async function () {
      const result = await hasReadme.audit({
        filePaths: ['a', 'b', 'c']
      }, {});

      chai.expect(result).to.eql({ score: 0 });
    });

    it('should return a score of 1 when readme is present', async function () {
      const result = await hasReadme.audit({
        filePaths: ['a', 'readme.md', 'c']
      }, {});
      
      chai.expect(result).to.eql({ score: 1 });
    });
  });
});
