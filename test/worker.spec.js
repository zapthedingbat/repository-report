const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("Worker", function() {
  let sandbox;
  let gatherers;
  let audits; 
  let renderers;
  let load;
  let loader;
  let gather;
  let createGatherer;
  let auditor;
  let createAuditor;
  let render;
  let createReportRenderer;
  let repositories;
  let reportGroups;
  let versionControl;
  let createVersionControl;
  let writer;
  let createWriter;
  let report;
  let reportBuilder;
  let worker;

  before(function () {
    sandbox = sinon.createSandbox();
    gatherers = 'cake';
    load = sandbox.stub();
    load.withArgs('./gather').returns(gatherers, 'test gather list');
    load.withArgs('./audit').returns(audits, 'test audit list');
    load.withArgs('./render').returns(renderers, 'test render list');
    loader = sandbox.stub().returns(load);
    gather = {};
    createGatherer = sandbox.stub().returns(gather);
    auditor = {};
    createAuditor = sandbox.stub().returns(auditor);
    render = sandbox.stub();
    createReportRenderer = sandbox.stub().returns(render);
    repositories = [];
    reportGroups = [{
      getRepositories: sandbox.stub().resolves(repositories)
    },{
      getRepositories: sandbox.stub().resolves(repositories)
    }];
    versionControl = {
      getReportGroups: sandbox.stub().resolves(reportGroups)
    }
    createVersionControl = sandbox.stub().resolves(versionControl);
    writer = {};
    createWriter = sandbox.stub().returns(writer);
    report = {};
    reportBuilder = sandbox.stub().resolves(report);
    process.env.GATHER = '';
    sandbox.stub(process.env, 'GATHER').value('test gather list');
    process.env.AUDIT = '';
    sandbox.stub(process.env, 'AUDIT').value('test audit list');    
    process.env.RENDER = '';
    sandbox.stub(process.env, 'RENDER').value('test render list');
    process.env.VCS = '';
    sandbox.stub(process.env, 'VCS').value('test vcs');
    worker = proxyquire("../src/worker", {
      "../src/lib/loader": loader,
      "../src/gatherer": createGatherer,
      "../src/auditor": createAuditor,
      "../src/report/renderer": createReportRenderer,
      "../src/version-control": createVersionControl,
      "../src/lib/file-writer": createWriter,
      "../src/report/builder": reportBuilder
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should gather assets and generate reports for each group of repositories", async function() {
    await worker();

    sinon.assert.calledWith(load, './gather', 'test gather list');
    sinon.assert.calledWith(createGatherer, gatherers);
    sinon.assert.calledWith(load, './audit', 'test audit list');
    sinon.assert.calledWith(createAuditor, audits);
    sinon.assert.calledWith(load, './render', 'test render list');
    sinon.assert.calledWith(createReportRenderer, renderers);
    sinon.assert.calledWith(createVersionControl, 'test vcs');
    sinon.assert.calledWith(createWriter, './.reports');
    sinon.assert.calledWith(reportBuilder, repositories, gather, auditor);
    sinon.assert.calledWith(render, reportGroups[0], report, writer);
    sinon.assert.calledWith(render, reportGroups[1], report, writer);
  });
});
