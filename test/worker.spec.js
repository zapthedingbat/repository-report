const sinon = require("sinon");
const dotenv = require("dotenv");
const fs = require("fs");
const proxyquire = require("proxyquire");
const github = require("../src/github");

describe("Worker", function() {
  let sandbox;
  let auditInstallation;
  let worker;

  before(function() {
    sandbox = sinon.createSandbox();
    sandbox.stub(dotenv, "config");
    process.env.GITHUB_APP_IDENTIFIER = "";
    sandbox.stub(process.env, "GITHUB_APP_IDENTIFIER").value("test app id");
    auditInstallation = sandbox.stub().resolves([])
    generateReports = sandbox.stub();
    worker = proxyquire("../src/worker", {
      "./github": github,
      "./installation": auditInstallation,
      "./report": generateReports
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should audit each installation of the app", async function() {
    sandbox.stub(fs, "readFileSync").returns("test key");
    sandbox.stub(github, "getAppToken").resolves("test app token");
    const createWriter = sandbox.stub();
    const render = sandbox.stub();
    const testInstallations = [
      {
        account: {
          login: "test installation one",
          avatar_url: "test avatar url",
          html_url: "test html url"
        }
      },
      {
        account: {
          login: "test installation two",
          avatar_url: "test avatar url",
          html_url: "test html url"
        }
      }
    ];
    sandbox.stub(github, "getInstallations").resolves(testInstallations);

    await worker(createWriter, render);

    sinon.assert.calledWith(github.getAppToken, "test key", "test app id");
    sinon.assert.calledWith(
      auditInstallation,
      testInstallations[0]
    );
    sinon.assert.calledWith(
      auditInstallation,
      testInstallations[1]
    );
    sinon.assert.calledWith(generateReports, [
      {
        document: {
          title: "test installation one",
          url: "test html url",
          imageUrl: "test avatar url"
        },
        results: []
      },
      {
        document: {
          title: "test installation two",
          url: "test html url",
          imageUrl: "test avatar url"
        },
        results: []
      }
    ]);
  });
});
