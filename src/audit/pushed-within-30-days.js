const withinDays = require("../lib/create-within-days-audit");

const days = 30;

module.exports = exports = withinDays(
  `Code was pushed within the last ${days} days`,
  `Repositories should be actively maintained.`,
  days,
  artefacts => artefacts.repository.pushedAt,
  (_, daysAgo) => `Repository was pushed to ${daysAgo} days ago.`,
  new Date()
);
