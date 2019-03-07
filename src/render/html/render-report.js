const icons = require("octicons");

function renderAll(fn, ary) {
  return ary.map(fn).join("\r\n");
}

function renderObject(fn, obj) {
  return Object.keys(obj).map((name, index) => fn(name, obj[name], index)).join("\r\n");
}

function renderJson(obj) {
  return `<pre>${JSON.stringify(obj, null, 2)}</pre>`;
}

function renderAudits(audits) {
  return renderJson(audits);
}

function renderRepositorySettingsButton(repository) {
  if (!repository.settingsUrl) {
    return '';
  }
  return `
<a class="btn btn-light btn-sm" role="button" href="${repository.settingsUrl}">
  ${icons.gear.toSVG()} Settings
</a>
`;
}

function renderRepositoryDescription(description) {
  return description
    ? `<div><span class="text-dark py-2">${description}</span></div>`
    : `<div><span class="text-muted py-2">No description set</span></div>`;
}

function renderAuditResults(audits, auditResults) {
  return Object.keys(auditResults).map(name => {
    const details = audits[name];
    const result = auditResults[name];
    return `<div>${details.title} ${result.pass}</div>`;
  });
}

function renderResult(audits, result) {
  const artefacts = result.artefacts;
  const repository = artefacts.repository;
  return `
<div class="list-group-item">

  <div class="my-4">
    <div class="d-flex flex-row justify-content-between">
      <h4 class="flex-grow-1">
        <a href="${repository.url}">${repository.title}</a>
      </h4>
      ${renderRepositorySettingsButton(repository)}
    </div>
    ${renderRepositoryDescription(repository.description)}
  </div>

  <div class="row my-4">
    <div class="col-sm-4">
      \${renderActivity(repository)}
      \${renderContributors(result.artefacts.contributors)}
      \${renderRunbooks(result.artefacts.runbooks)}
    </div>
    <div class="col-sm-8">
      \${renderClassification(result.classification)}
    </div>
  </div>

  ${renderAuditResults(audits, result.results)}
</div>
`;
}

function renderResults(audits, results) {
  return `
<div class="list-group list-group-flush">
  ${renderAll((result) => renderResult(audits, result), results)}
</div>`
}

module.exports = exports = function renderReport({ audits, results }) {
  return `
  ${renderAudits(audits)}
  ${renderResults(audits, results)}
  `;
}
