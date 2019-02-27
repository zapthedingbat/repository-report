const renderReportDetails = details => {
  if (!details) {
    return '';
  }
  if (details.items) {
    const keys = Object.keys(details.items[0]);
    `<table class="repository-report-details">
    <tr>
    ${keys.map(key => `<th>${key}</th>`).join('')}
    </tr>
    ${details.items.map(item => `<tr>${keys.map(key => `<td>${item[key]}</td>`).join('')}</tr>`).join()}
    </table>`;
  }
};

const renderReports = reports => reports.map(report => `
  <h2>${report.name}</h2>
  <p>${report.description}</p>
  <div class="repository-report-score">Score: ${report.result.score}</div>
  ${renderReportDetails(report.result.details)}
`).join('\n');

const renderHtml = (data) => `
  <div class="repository">
  <h1 class="repository-name"><a class="repository-link" href="${data.repository.html_url}">${data.repository.full_name}</a></h1>
  <div class="repository-description">${data.repository.description}</div>
  <div class="repository-reports">
    ${renderReports(data.reports)}
  </div>
  </div>
`;

function render(data) {
  process.stdout.write(renderHtml(data));
}

module.exports = render;
