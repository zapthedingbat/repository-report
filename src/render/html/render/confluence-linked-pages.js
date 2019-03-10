const { renderAll } = require('./util');

function renderConfluenceLinkedPage(confluenceLinkedPage) {
  return `
  <div>
    <a href="${confluenceLinkedPage.url}">
      ${confluenceLinkedPage.title}
    </a>
  </div>
  `;
}

module.exports = exports = function renderConfluenceLinkedPages(confluenceLinkedPages) {
  if (confluenceLinkedPages.length > 0) {
    return `
    <div class="mb-4">
      <h6>Links from confluence</h6>
      ${renderAll(renderConfluenceLinkedPage, confluenceLinkedPages)}
    </div>
    `;
  } else {
    let createLink = '';
    if (process.env.CONFLUENCE_CREATE_RUNBOOK_URL) {
      createLink = `<a class="alert-link" href="${process.env.CONFLUENCE_CREATE_RUNBOOK_URL}">a link to the repository</a>`;
    } else {
      createLink = 'a link to the repository';
    }
    return `
    <div class="my-2">
      <h6>Links from confluence</h6>
      <div class="alert alert-warning mb-2">
        <strong>Not found</strong> Include ${createLink} from a confluence page.
      </div>
    </div>
    `;
  }
}
