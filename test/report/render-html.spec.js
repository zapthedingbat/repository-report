const chai = require('chai');
const renderHtml = require('../../src/report/render-html');

const expect = chai.expect;

describe('Report HTML', function () {

  it('should render a report to HTML', function () {
    const html = renderHtml(
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

    expect(html).to.equal(`<div class="repository">
<h1 class="repository-name"><a class="repository-link" href="test html_url">test full_name</a></h1>
<div class="repository-description">test description</div>
<div class="repository-reports">
<h2>test name</h2>
<p>test description</p>
<div class="repository-report-score">Score: 0</div>
<table class="repository-report-details">
<tr><th>key</th></tr>
<tr><td>value</td></tr>
</table>
</div>
</div>`);
  });
});
