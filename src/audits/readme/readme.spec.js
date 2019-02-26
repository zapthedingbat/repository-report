const chai = require('chai');
const sinon = require('sinon');

describe('Readme Analyser', function () {
  let sandbox;
  
  before(function () {
    sandbox = sinon.createSandbox();
  });
  
  afterEach(function () {
    sandbox.restore();
  });
  
  describe('Content Length', function () {

  });
});
