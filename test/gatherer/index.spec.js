const chai = require("chai");
const sinon = require("sinon");
const gatherer = require("../../src/gather");

describe('gatherer', function () {
  it('should return assets that are the result of each gatherer', async function () {
    const gatherers = {
      "one": sinon.stub().resolves("asset one"),
      "two": sinon.stub().resolves("asset two")
    }

    const actual = await gatherer(gatherers);

    chai.expect(actual).to.eql({
      one: 'asset one',
      two: 'asset two'
    });
  })
})
