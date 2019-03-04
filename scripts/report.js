const generateReports = require('../src/report/index');
const json = require('../.reports/report.json');

(async function main() {
  await generateReports('', json.results);
}());
