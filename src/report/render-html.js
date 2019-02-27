const renderReports = reports => reports.map(report => `
  <h2>${report.name}</h2>
  <p>${report.description}</p>
  <pre>
  ...
  </pre>
`).join();

const renderHtml = (data) => `<doctype html>
<html lang='en'>
<head>
    <title>Report</title>
<head>
<body>
  <h1>Report ${data.name}</h1>
  ${renderReports(data.reports)}
</html>
`;

function render(data) {
  process.stdout.write(renderHtml(data));
}

module.exports = render;
