const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { EventEmitter } = require('events');

describe('GitHub Clone', function () {
  let sandbox;
  let clone;
  let childProcess;

  before(function () {
    sandbox = sinon.createSandbox();
  });
  
  beforeEach(function () {
    childProcess = { spawn: sandbox.stub() };
    clone = proxyquire('./clone', {
      'child_process': childProcess,
    });
  })

  afterEach(function () {
    sandbox.restore();
  });

  it('should git-clone the repository with the specified token', async function () {
    const testProcess = new EventEmitter();
    childProcess.spawn.returns(testProcess);
    
    const clonePromise = clone('test-token', 'http://test/url', 'test working directory');
    testProcess.emit('close', 0);
    await clonePromise;

    sinon.assert.calledWithExactly(childProcess.spawn, 'git', ["clone", "http://x-access-token:test-token@test/url", "test working directory"]);
  });
});
