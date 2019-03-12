const { expect } = require("chai");
const sinon = require("sinon");
const filePaths = require("../../src/gather/file-paths");

describe('Gather file paths', function () {
  it('should return file paths from the repository', async function () {
    const mockRepository = { getFilePaths: sinon.stub().resolves(['test file paths']) }

    const actual = await filePaths(mockRepository)

    expect(actual).to.eql(['test file paths']);
  });
})
