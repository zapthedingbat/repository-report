const chai = require('chai');
const renderJson = require('../../src/report/render-json');

const expect = chai.expect;

describe('Report JSON', function () {

  it('should render a report to JSON', function () {
    const json = renderJson(
      {
        html_url: 'test html_url',
        full_name: 'test full_name',
        description: 'test description'
      },
      [
        {
          name: 'test name',
          description: 'test description',
          result: {
            score: 0,
            details: {
              items: [{ key: 'value' }]
            }
          }
        }
      ]
    );

    expect(json).to.equal('{"repository":{"html_url":"test html_url","full_name":"test full_name","description":"test description"},"results":[{"name":"test name","description":"test description","result":{"score":0,"details":{"items":[{"key":"value"}]}}}]}');
  });
});
