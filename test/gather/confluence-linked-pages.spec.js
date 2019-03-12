const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Gather confluence linked pages', function () {
  let sandbox;
  let audit;
  let createCacheFetch;
  let cacheFetch;

  before(function () {
    sandbox = sinon.createSandbox();
    cacheFetch = sandbox.stub();
    createCacheFetch = sandbox.stub().returns(cacheFetch)
    audit = proxyquire('../../src/gather/confluence-linked-pages', {
      '../../src/lib/cache-fetch': createCacheFetch
    })
  })

  it('should work return an array of results from a confluence search', async function () {
    const mockJson = {
      _links: { base: 'test base/' },
      results: [{
        content: {
          title: 'test title',
          _links: {
            webui: 'test url'
          }
        }
      }]
    };
    const mockResponse = { json: sandbox.stub().resolves(mockJson) };
    cacheFetch.resolves(mockResponse);

    process.env.CONFLUENCE_USER = '';
    process.env.CONFLUENCE_PASSWORD = '';
    process.env.CONFLUENCE_ORIGIN = '';

    sandbox.stub(process.env, 'CONFLUENCE_USER').value('test user')
    sandbox.stub(process.env, 'CONFLUENCE_PASSWORD').value('test password')
    sandbox.stub(process.env, 'CONFLUENCE_ORIGIN').value('test origin')

    const result = await audit({ url: 'test url' });
    
    sinon.assert.calledWith(cacheFetch, 'test origin/rest/api/search?cql=text~"test?url"%20and%20type=page&os_authType=basic', {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic dGVzdCB1c2VyOnRlc3QgcGFzc3dvcmQ="
      }
    });

    expect(result).to.eql([{
      title: 'test title',
      url: 'test base/test url'
    }]);
  });
});
