const generateReports = require('./report/index');
const json = require('../.reports/conde-nast-international.json');

(async function main() {
  await generateReports('', 'owner', json.results);
}());
