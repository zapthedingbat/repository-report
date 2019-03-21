const { expect } = require("chai");
const repository = require("../../src/gather/repository");

describe('Gather repository', function () {
  it('should return the repository', async function () {
    const mockRepository = {}

    const actual = await repository(mockRepository);

    expect(actual).to.equal(mockRepository);
  });
})
