const { nodeDependencies } = require('./node-dependencies');
const { readme } = require('./readme');

// TODO: Make list of audits configurable
async function run(assets, context) {
  const audits = [
    nodeDependencies,
    readme
  ];

  for (audit in audits) {
    try {
      await audit.audit(assets, context);
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = {
  run
}
