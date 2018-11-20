const chai = require('chai');
const sinon = require('sinon');
const os = require('os');
const fs = require('fs');
const path = require('path');
const workingDirectory = require('./working-directory');

const expect = chai.expect;

describe('Working Directory', function () {
  let sandbox;

  before(function () {
    sandbox = sinon.createSandbox();
  });
  
  afterEach(function () {
    sandbox.restore();
  });

  describe('Prepare', function () {
    
    it('should create the empty working directory', async function () {
      sandbox.stub(os, 'tmpdir').returns('test-temp-dir');
      const fsMkdirSync = sandbox.stub(fs, 'mkdirSync');
      
      const actual = workingDirectory.prepare('test-owner', 'test-name');
      
      expect(actual).to.equal(`test-temp-dir${path.sep}github-tech-report${path.sep}test-owner${path.sep}test-name`);
      sinon.assert.calledWith(fsMkdirSync, `test-temp-dir${path.sep}github-tech-report${path.sep}test-owner${path.sep}test-name`);
    });
  
    it('should remove the working directory if it already exists', async function () {
      sandbox.stub(os, 'tmpdir').returns('test-temp-dir');
      sandbox.stub(fs, 'mkdirSync');
      const fsUnlinkSync = sandbox.stub(fs, 'unlinkSync');
      const fsRmdirSync = sandbox.stub(fs, 'rmdirSync');
      const expectedDirectory = `test-temp-dir${path.sep}github-tech-report${path.sep}test-owner${path.sep}test-name`;
      const expectedSubDirectory = `${expectedDirectory}${path.sep}test-directory`;
      const expectedFile = `${expectedDirectory}${path.sep}test-file`;
      const fsExistsSync = sandbox.stub(fs, 'existsSync');
      fsExistsSync
        .withArgs(expectedDirectory)
        .returns(true);
      fsExistsSync
        .withArgs(expectedSubDirectory)
        .returns(true);
      fsExistsSync
        .returns(false);
      const fsLstatSync = sandbox.stub(fs, 'lstatSync');
      fsLstatSync
        .withArgs(expectedSubDirectory)
        .returns({ isDirectory: () => true });
      fsLstatSync
        .returns({ isDirectory: () => false });
      const fsReaddirSync = sandbox.stub(fs, 'readdirSync');
      fsReaddirSync
        .onFirstCall()
        .returns(['test-directory', 'test-file']);
      fsReaddirSync
        .returns([]);
    
      workingDirectory.prepare('test-owner', 'test-name');
    
      sinon.assert.calledWith(fsLstatSync, expectedSubDirectory);
      sinon.assert.calledWith(fsUnlinkSync, expectedFile);
      sinon.assert.calledWith(fsRmdirSync, expectedSubDirectory);
      sinon.assert.calledWith(fsRmdirSync, expectedDirectory);
    });
  });
});
