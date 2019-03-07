const { classify } = require('./maturity-model');
const { withDocument, withGroup } = require('./render');
const renderReport = require('./render-report');

module.exports = exports = function html({ group, audits, results }) {

  // TODO: Apply maturity model to the results
  // const model = maturityModel.classify(results);

  const render = withDocument(
    withGroup(
      renderReport,
      group
    ),
    'title'
  );

  return render({ audits, results })
}
