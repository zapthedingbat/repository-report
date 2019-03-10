module.exports = exports = function renderRepositoryDescription(description) {
  return description
    ? `<div><span class="text-dark py-2">${description}</span></div>`
    : `<div><span class="text-muted py-2">No description set</span></div>`;
}
