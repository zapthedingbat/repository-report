const { renderAll } = require('./util');

function renderContributor(contributor) {
  return `
  <div class="d-flex justify-content-between align-items-center">
    <img class="mr-1" height="20" width="20" src="${contributor.imageUrl}">
    <a class="flex-grow-1 p-1" href="${contributor.url}">
      ${contributor.name}
    </a>
    <div>
      ${contributor.contributions}
    </div>
  </div>
  `;
}

module.exports = exports = function renderContributors(contributors) {
  return `
  <div class="mb-4">
    <h6>Contributions</h6>
    <div>
      ${renderAll(renderContributor, contributors)}
    </div>
  </div>
  `;
}
