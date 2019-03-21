const timeAgo = require('./time-ago');

module.exports = exports = function renderActivity(repository, refDate) {
  return `
  <div class="mb-4">
    <div title="${repository.createdAt}">Created ${timeAgo(repository.createdAt, refDate)}</div>
    <div title="${repository.pushedAt}">Pushed to ${timeAgo(repository.pushedAt, refDate)}</div>
  </div>
  `;
}
