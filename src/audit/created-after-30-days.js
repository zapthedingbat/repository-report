const afterDays = require("../lib/create-after-days-audit");

const days = 30;

function message(pass, daysAgo) {
  if (daysAgo === 0) {
    return `Repository was created today!`
  }

  if (daysAgo === 1) {
    return `Repository was created yesterday!`
  }

  if (pass) {
    return `Repository was only created ${daysAgo} days ago.`
  }

  return `Repository was created ${daysAgo} days ago.`
}

module.exports = exports = afterDays(
  `Repository was created more than ${days} days ago.`,
  `Projects often take time to reach maturity. The ongoing stewardship of a project can be as difficult then it's creation. Try to stay focused on reaching a clear and realistic milestone early.`,
  days,
  artefacts => artefacts.repository.createdAt,
  message
);
