const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("Repository", function() {
  let sandbox;
  let github;
  let readFile;
  let getConfluencePages;
  let maturityModel

  before(function() {
    sandbox = sinon.createSandbox();
    github = { getTreeFiles: sandbox.stub() };
    readFile = sandbox.stub();
    getConfluencePages = sandbox.stub();
    createGithubReadFile = sandbox.stub().returns(readFile);
    maturityModel = {
      classify: sandbox.stub().resolves()
    }
    auditRepository = proxyquire("../../../src/version-control/github/repository", {
      "./main": github,
      "./read-file": createGithubReadFile,
      "./../../gather/confluence/get-confluence-pages": getConfluencePages,
      "./../../report/maturity-model": maturityModel,
      "./../../lib/logger": {}
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should get a list of the file paths in the repo", async function() {
    github.getTreeFiles.resolves({
      tree: [{ path: "test file path one" }, { path: "test file path two" }]
    });

    await auditRepository("test token", {
      owner: { login: "test login" },
      name: "test name",
      default_branch: "test default_branch"
    });

    sinon.assert.calledWith(
      createGithubReadFile,
      "test token",
      "test login",
      "test name",
      "test default_branch"
    );
    sinon.assert.calledWith(
      maturityModel.classify,
      {
        contributors: [], 
        filePaths: ["test file path one", "test file path two"], 
        repository: { 
          default_branch: "test default_branch", 
          name: "test name", 
          owner: { login: "test login" } 
        }, 
        runbooks: undefined
      },
      { readFile }
    );
  });
});
