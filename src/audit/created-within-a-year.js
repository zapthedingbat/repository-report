const withinDays = require("../lib/create-within-days-audit");

const days = 365;

module.exports = exports = withinDays(
  `Repository is less than a year old`,
  `The project has been around for a while.`,
  days,
  artefacts => artefacts.repository.createdAt,
  (_, daysAgo) => `Repository was created ${daysAgo} days ago.`,
  new Date()
);
