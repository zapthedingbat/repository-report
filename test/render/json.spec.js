const snapshot = require("../../test-support/snapshot");
const json = require("../../src/render/json")

describe("Render JSON report", function() {

  it("should match the report snapshot", function () {
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

    const actual = json(group, {audits, results});
    
    snapshot("./test/render/json.snapshot", actual);
  });
});
