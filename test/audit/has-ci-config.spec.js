const { expect } = require("chai");
const sinon = require("sinon");
const audit = require("../../src/audit/has-ci-config");

describe('Audit repository contains CI configuration file', function () {
  let sandbox;

  before(function () {
    sandbox = sinon.createSandbox();
  })
  
  afterEach(function () {
    sandbox.restore();
  })
  
  it('should have a title', async function () {
    expect(audit.details.title).to.equal('Has continuous integration configuration');
  });
  
  it('should have a description', async function () {
    expect(audit.details.description).to.equal('Use an automated process to check committed code and detect problems early.');
  });
  
  describe('getting results', function () {
    it('should fail when no CI file is present', function () {
      const result = audit.getResults({ "file-paths": [] });
      
      expect(result).to.eql({
        pass: false,
        score: 0,
        message: 'No CI configuration file was found.'
      });
    });

    it('should succeed when a CI file is present', function () {
      const result = audit.getResults({
        "file-paths": [
          '.circleci/config.yml',
          'travis.yml'
        ]
      });
      
      expect(result).to.eql({
        pass: true,
        score: 1,
        message: 'Found 2 config files config.yml, travis.yml'
      });
    });
  })
});
