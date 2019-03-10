module.exports = exports = function renderToc(results) {
  return `
<div class="my-4 d-flex flex-wrap justify-content-around align-items-center align-content-center">
  ${results.map(r => `
  <div class="d-inline-flex m-1">
    <a class="text-${r.classification.matched.name}" href="#repo-${r.artefacts.repository.title}">${r.artefacts.repository.title}</a>
  </div>
  `).join('')}
</div>`
}
