const chai = require("chai");
const sinon = require("sinon");
const gatherer = require("../src/gatherer");

describe('gatherer', function () {
  it('should return assets that are the result of each gatherer', async function () {
    const gatherers = {
      one: sinon.stub().resolves("asset one"),
      two: sinon.stub().resolves("asset two")
    }
    const gather = gatherer(gatherers);
    const testRepository = 'test repository'

    const actual = await gather(testRepository);

    sinon.assert.calledWith(gatherers.one, testRepository);
    sinon.assert.calledWith(gatherers.two, testRepository);
    chai.expect(actual).to.eql({
      one: 'asset one',
      two: 'asset two'
    });
  })
})
