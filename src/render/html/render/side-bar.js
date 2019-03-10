const renderActivity = require('./activity');
const renderContributors = require('./contributors');
const renderConfluenceLinkedPages = require('./confluence-linked-pages');

module.exports = exports = function renderSideBar(result) {
  return `
<div>
  ${renderActivity(result.artefacts.repository)}
  ${renderContributors(result.artefacts.contributors)}
  ${renderConfluenceLinkedPages(result.artefacts['confluence-linked-pages'])}
</div>
  `
}
