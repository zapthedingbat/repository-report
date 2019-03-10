const timeAgo = require('./time-ago');

module.exports = exports = function renderActivity(repository) {
  return `
  <div class="mb-4">
    <div title="${repository.createdAt}">Created ${timeAgo(repository.createdAt)}</div>
    <div title="${repository.pushedAt}">Pushed to ${timeAgo(repository.pushedAt)}</div>
  </div>
  `;
}
