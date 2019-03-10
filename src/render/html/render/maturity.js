const renderMaturityMatrix = require('./maturity-matrix');

module.exports = exports = function renderMaturity(audits, classification) {
  return `
<div>
  <div class="card mb-4 bg-${classification.matched.name}">
    <div class="card-body text-white">
      <h5 class="card-title">${classification.matched.title}</h5>
      <p>
        ${classification.matched.description}
      </p>
    </div>
  </div>
  ${renderMaturityMatrix(audits, classification)}
</div>
  `
}
