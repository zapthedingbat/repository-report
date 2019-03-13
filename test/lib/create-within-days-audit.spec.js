const { expect } = require('chai');
const sinon = require('sinon');
const createWithinDaysAudit = require('../../src/lib/create-within-days-audit');

describe('Create within days audit', function () {
  describe('getting results', function () {
    it('should fail if the specified days have passed', function () {
      const artefactsDate = new Date();
      artefactsDate.setDate(artefactsDate.getDate() - 20);
      const artefacts = {};
      const artefactsDateFn = sinon.stub().returns(artefactsDate);
      const messageFn = sinon.stub().returns('test message');
      const audit = createWithinDaysAudit('test title', 'test description', 10, artefactsDateFn, messageFn);

      const result = audit.getResults(artefacts);

      sinon.assert.calledWith(artefactsDateFn, artefacts);
      sinon.assert.calledWith(messageFn, false, 20);
      expect(result).to.eql({
        pass: false,
        score: 0,
        message: 'test message'
      })
    })

    it('should be successfully if the specified days have not passed', function () {
      const artefactsDate = new Date();
      artefactsDate.setDate(artefactsDate.getDate() - 5);
      const artefacts = {};
      const artefactsDateFn = sinon.stub().returns(artefactsDate);
      const messageFn = sinon.stub().returns('test message');
      const audit = createWithinDaysAudit('test title', 'test description', 10, artefactsDateFn, messageFn);

      const result = audit.getResults(artefacts);

      sinon.assert.calledWith(artefactsDateFn, artefacts);
      sinon.assert.calledWith(messageFn, true, 5);
      expect(result).eql({
        pass: true,
        score: 1,
        message: 'test message'
      })
    })
  })
})
