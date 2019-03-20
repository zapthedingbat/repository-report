const renderActivity = require('./activity');
const renderContributors = require('./contributors');
const renderConfluenceLinkedPages = require('./confluence-linked-pages');

module.exports = exports = function renderSideBar(result, refDate) {
  return `
<div>
  ${renderActivity(result.artefacts.repository, refDate)}
  ${renderContributors(result.artefacts.contributors)}
  ${renderConfluenceLinkedPages(result.artefacts['confluence-linked-pages'])}
</div>
  `
}
