const renderSections = (data) => data.map(section => `
  <h2>${section.title}</h2>
`).join();

const renderHtml = (data) => `<doctype html>
<html lang='en'>
<head>
    <title>Report</title>
<head>
<body>
  <h1>Report</h1>
  ${renderSections(data.sections)}
</html>
`;

function render(report) {
  process.stdout.write(renderHtml(report));
}

module.exports = render;
