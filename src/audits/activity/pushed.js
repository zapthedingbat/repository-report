const name = "Recent commits";
const description = "The project should continue to be maintained.";

async function audit(artifacts, context) {
  const pushedAtDate = new Date(artifacts.repository.pushed_at);
  const msDay = 1000 * 60 * 60 * 24;
  const days = Math.floor((Date.now() - pushedAtDate.getTime()) / msDay);
  const goodDays = 7; // Days before score decreases
  const badDays = 60; // Days when score hits zero
  const pastGood = Math.max(days - goodDays, 0);
  const score = 1 - Math.min(pastGood / badDays, 1);

  return {
    score
  };
}

module.exports = {
  name,
  description,
  audit
};
