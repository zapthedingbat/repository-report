module.exports = exports = function renderMaturitySummary(results) {
  const totalCount = results.length;
  const classificationCounts = classifications.map(classification => {
    let count = results.filter(result => result.classification.matched.name === classification.details.name).length;
    return Object.assign({}, classification, { count });
  });

  return `
<div class="card-group my-4">
  ${classificationCounts.map(classificationCount => {
    return `
    <div class="card">
      <div class="card-header">
        ${classificationCount.details.title}
      </div>
      <div class="card-body text-center">
        <span class="card-title display-4 text-nowrap text-${classificationCount.details.name}">${classificationCount.count}</span>
        <span class="text-muted"><small>${Math.round((classificationCount.count / totalCount) * 100)}%</small></span>
      </div>
    </div>
    `
  }).join('')}
</div>

<div class="progress my-4" style="height: 2rem">
  ${classificationCounts.map(classificationCount => {
    const percent = (classificationCount.count / totalCount) * 100;
    return `<div class="progress-bar bg-${classificationCount.details.name}" role="progressbar" style="width: ${percent}%">${Math.round(percent)}%</div>`
  }).join('')}
</div>
  `
}
