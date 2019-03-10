const withinDays = require("../lib/create-within-days-audit");

const days = 365;

module.exports = exports = withinDays(
  `Code was pushed within a year`,
  `Repositories should be actively maintained.`,
  days,
  artefacts => artefacts.repository.pushedAt,
  (_, daysAgo) => `Repository was pushed to ${daysAgo} days ago.`
);
