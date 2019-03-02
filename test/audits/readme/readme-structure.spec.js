const chai = require('chai');
const readmeStructure = require('../../../src/audits/readme/readme-structure');

describe('Readme structure', function () {
  describe('description', function () {
    it('should have a description', function () {
      chai.expect(readmeStructure.description).to.equal('Include helpful topics in the project readme file');
    });
  });

  describe('audit', function () {
    it('should return a score of 0 when readme contains less than 2 headings', async function () {
      const testFileContents = `test\n#readme\nfile\n`;
      
      const result = await readmeStructure.audit({
        filePaths: ['readme.md']
      }, { readFile: () => testFileContents});

      chai.expect(result).to.eql({ score: 0, details: { items: [{ heading: '#readme' }] } });
    });

    it('should return a score of 1 when readme contains more than 2 headings', async function () {
      const testFileContents = `a\n#test\n#readme\n##file\nwith\n#multiple headings\n`;
      
      const result = await readmeStructure.audit({
        filePaths: ['readme.md']
      }, { readFile: () => testFileContents});

      chai.expect(result).to.eql({
        score: 1,
        details: {
          items: [
            { heading: '#test' },
            { heading: '#readme' },
            { heading: '##file' },
            { heading: '#multiple headings' }
          ]
        }
      });
    });
  });
});
