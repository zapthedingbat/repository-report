const chai = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');
const writeFiles = require('./write-files');
const expect = chai.expect;

describe('Write Files', function () {
  let sandbox;

  before(function () {
    sandbox = sinon.createSandbox();
  });
  
  afterEach(function () {
    sandbox.restore();
  });
  
  describe('Create Writer', function () {

    describe('Writer', function () {

      it('should return a function that writes to a file in the specified directory', async function () {
        const mockStream = {
          write: sandbox.stub().yields()
        }
        sandbox.stub(fs, 'createWriteStream').returns(mockStream);
        sandbox.stub(path, 'join').returns('mock path');
        const createWriter = writeFiles('test dir');
        const writer = createWriter('test name');

        await writer('test data');

        expect(createWriter).to.be.a('function');
        expect(writer).to.be.a('function');
        sinon.assert.calledWith(fs.createWriteStream, 'mock path');
        sinon.assert.calledWith(mockStream.write, 'test data');
      })
    });

  });
});
