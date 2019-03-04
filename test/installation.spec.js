const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("Installation", function() {
  let sandbox;
  let github;
  let auditRepository;

  before(function() {
    sandbox = sinon.createSandbox();
    github = {
      post: sandbox.stub(),
      getPaginated: sandbox.stub()
    };
    auditRepository = sandbox.stub();
    auditInstallation = proxyquire("../src/installation", {
      "./github": github,
      "./repository": auditRepository
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should audit the repositories for an installation", async function() {
    github.post.resolves({ token: "test installation token" });
    const mockRepositories = [
      { owner: { id: "test owner" }, fork: false, archived: false },
      { owner: { id: "test owner" }, fork: false, archived: false }
    ];
    const mockResults = {};
    github.getPaginated.resolves(mockRepositories);
    auditRepository.resolves(mockResults);

    await auditInstallation(
      {
        account: { id: "test owner" },
        access_tokens_url: "test access_tokens_url",
        repositories_url: "test repositories_url"
      },
      "test token"
    );

    sinon.assert.calledWith(
      github.post,
      "test token",
      "test access_tokens_url"
    );
    sinon.assert.calledWith(
      github.getPaginated,
      "test installation token",
      "test repositories_url"
    );
    sinon.assert.calledWith(
      auditRepository,
      "test installation token",
      mockRepositories[0]
    );
    sinon.assert.calledWith(
      auditRepository,
      "test installation token",
      mockRepositories[1]
    );
  });
});
