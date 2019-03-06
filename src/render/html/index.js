const { classify } = require('./maturity-model');
const { withDocument, withOrganisation } = require('./render');

module.exports = exports = function html({ frontMatter, audits, results }) {

  // TODO: Apply maturity model to the results
  // const model = maturityModel.classify(results);

  const render = withDocument(
    withOrganisation(
      () => `Hello`,
      frontMatter
    ),
    frontMatter.title
  );
  return render(audits, results)
}
