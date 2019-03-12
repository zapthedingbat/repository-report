const { expect } = require("chai");
const sinon = require("sinon");
const readme = require("../../src/gather/readme");

describe('Gather readme', function () {
  it('should return readme from the repository', async function () {
    const mockRepository = {
      getFilePaths: sinon.stub().resolves(['readme.md']),
      readFile: sinon.stub().resolves('test readme')
    }

    const actual = await readme(mockRepository);

    expect(actual).to.eql('test readme');
  });
})
