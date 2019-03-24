const sinon = require("sinon");
const snapshot = require("../../test-support/snapshot");
const proxyquire = require("proxyquire");

describe("Render HTML report", function() {
  let sandbox;
  let html;
  
  before(function () {
    const classifications = [{
      details: {
        name: 'test-failing-classification',
        title: 'Test Failing Classification',
        description: 'Test failing classification description',
      },
      auditCriteria: [
        'test-failing-audit',
        'test-passing-audit',
      ]
    },{
      details: {
        name: 'test-passing-classification',
        title: 'Test Passing Classification',
        description: 'Test passing classification description',
      },
      auditCriteria: [
        'test-passing-audit',
      ]
    }];
    sandbox = sinon.createSandbox();
    const renderReport = proxyquire
      .noCallThru()
      .load('../../src/render/html/render/report', {
      "../../../../src/classifications": classifications
    })
    html = proxyquire
      .noCallThru()
      .load("../../src/render/html", {
      "../../../src/render/html/render/report": renderReport
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should match the report snapshot", function () {
    this.timeout(60000);
    const group = {
      name: 'test group name'
    };
    const audits = {
      "test-failing-audit": { details: 'cake' },
      "test-passing-audit": { details: 'cake' }
    };
    const results = [{
      artefacts: {
        "repository": {
          title: "test repository title",
          createdAt: new Date('1900-01-01'),
          pushedAt: new Date('1900-01-01'),
        },
        "contributors": [{
          "title": "test contributor title",
          "url": "test contributor url"
        }],
        "confluence-linked-pages": [{
          "title": "test confluence-linked-page title",
          "url": "test confluence-linked-page url"
        }]
      },
      results: {
        "test-passing-audit": {
          "pass": true,
          "score": 1,
          "message": "test-message-1"
        },
        "test-failing-audit": {
          "pass": false,
          "score": 0.5,
          "message": "test-message-2"
        }
      }
    }];

    const refDate = new Date(2019-03-20);
    const actual = html(group, {audits, results}, refDate);
    
    snapshot("./test/render/html.snapshot", actual);
  });
});
