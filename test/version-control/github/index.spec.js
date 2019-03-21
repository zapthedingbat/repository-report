const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("GitHub", function () {
  let sandbox;
  let createGithub;
  let appToken;
  let getAppToken;
  let createApi;
  let api;

  before(function () {
    sandbox = sinon.createSandbox();
    api = {
      getInstallations: sandbox.stub(),
      request: sandbox.stub(),
      getPaginated: sandbox.stub(),
      getFilePaths: sandbox.stub(),
      readFile: sandbox.stub()
    };
    createApi = sandbox.stub().returns(api);
    appToken = 'test app token';
    getAppToken = sandbox.stub().resolves(appToken),
      createGithub = proxyquire('../../../src/version-control/github', {
        "../../../src/version-control/github/get-app-token": getAppToken,
        "../../../src/version-control/github/api": createApi
      })
  })

  describe("Creating", function () {
    it('should get the app token', async function () {
      await createGithub();
  
      sinon.assert.called(getAppToken);
    });

    describe("Get report groups", function () {
      let installations;
      let github;

      before(async function () {
        installations = [{
          account: {
            login: 'test login',
            avatar_url: 'test avatar url',
            description: 'test description'
          },
          access_tokens_url: 'test access tokens url',
          repositories_url: 'test repositories url'
        }];
        api.getInstallations.resolves(installations);

        github = await createGithub();
      })

      it('should get the report group from the api', async function () {
        const reportGroups = await github.getReportGroups();

        sinon.assert.calledWith(api.getInstallations, appToken);
        expect(reportGroups[0].name).to.equal('test login');
        expect(reportGroups[0].imageUrl).to.equal('test avatar url');
        expect(reportGroups[0].description).to.equal('test description');
      });

      describe("Report group", function () {
        let reportGroup;
        
        before(async function () {
          const reportGroups = await github.getReportGroups();
          reportGroup = reportGroups[0];
        })

        it('should get repositories from the api', async function () {
          const mockJson = { token: 'test token' };
          const mockResponse = {
            json: sandbox.stub().resolves(mockJson)
          }
          api.request.resolves(mockResponse);
          api.getPaginated.resolves([{
            name: 'test name',
            description: 'test description',
            html_url: 'test html url',
            created_at: '2000-01-02',
            pushed_at: '2000-03-04',
            default_branch: 'test default branch',
            contributors_url: 'test contributors url',
            owner: {
              login: 'test login',
            }
          }]);
          
          const repositories = await reportGroup.getRepositories();
  
          const firstRepository = repositories[0];
          expect(firstRepository).to.include({
            description: "test description",
            settingsUrl: "test html url/settings",
            title: "test name",
            url: "test html url",
          });
          expect(firstRepository).to.have.property('createdAt').that.eql(new Date('2000-01-02'));
          expect(firstRepository).to.have.property('pushedAt').that.eql(new Date('2000-03-04'));
          expect(firstRepository).to.have.property('getFilePaths').that.is.a('function');
          expect(firstRepository).to.have.property('getContributors').that.is.a('function');
          expect(firstRepository).to.have.property('readFile').that.is.a('function');
        });

        describe("Repository", function () {
          let repository;

          before(async function () {
            const mockJson = { token: 'test token' };
            const mockResponse = {
              json: sandbox.stub().resolves(mockJson)
            }
            api.request.resolves(mockResponse);
            api.getPaginated.resolves([{
              name: 'test name',
              description: 'test description',
              html_url: 'test html url',
              created_at: '2000-01-02',
              pushed_at: '2000-03-04',
              default_branch: 'test default branch',
              contributors_url: 'test contributors url',
              owner: {
                login: 'test login',
              }
            }]);
            const repositories = await reportGroup.getRepositories();
            repository = repositories[0];
          });

          describe('get file paths', function () {
            it('should get file paths from API', async function () {
              const testFilePaths = [];
              api.getFilePaths.resolves(testFilePaths);

              const filePaths = await repository.getFilePaths();

              expect(filePaths).to.equal(testFilePaths);
              sinon.assert.calledWithExactly(api.getFilePaths, 'test token', 'test login', 'test name', 'test default branch');
            });
          });

          describe('get contributors', function () {
            it('should contributors with API', async function () {
              const testContributors = [{
                login: 'test login',
                html_url: 'test html url',
                avatar_url: 'test avatar_url',
                contributions: 'test contributions'
              }];
              api.getPaginated.resolves(testContributors);

              const filePaths = await repository.getContributors();

              expect(filePaths).to.eql([{
                name: 'test login',
                url: 'test html url',
                imageUrl: 'test avatar_url',
                contributions: 'test contributions',
              }]);
              sinon.assert.calledWithExactly(api.getPaginated, 'test token', 'GET', 'test contributors url', sinon.match.func);
            });
          });

          describe('read file', function () {
            it('should read file with API', async function () {
              const testFile = ''
              api.readFile.resolves(testFile);

              const file = await repository.readFile('test path');

              expect(file).to.equal(testFile);
              sinon.assert.calledWithExactly(api.readFile, 'test token', 'test login', 'test name', 'test default branch', 'test path');
            });
          });
        });
      });
    })
  })
})  
