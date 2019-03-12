const { expect } = require("chai");
const sinon = require("sinon");
const contributors = require("../../src/gather/contributors");

describe('Gather contributors', function () {
  it('should return contributors from the repository', async function () {
    const mockRepository = { getContributors: sinon.stub().resolves(['test contributors']) }

    const actual = await contributors(mockRepository)

    expect(actual).to.eql(['test contributors']);
  });
})
