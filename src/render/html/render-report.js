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

function renderAuditResult({ details, result }) {
  const cssTextClass = result.pass ? 'text-success' : 'text-danger';
  const check = result.pass ? icons.check.toSVG() : icons.x.toSVG();
  return `
  <div class="list-group-item">
    <div class="d-flex justify-content-between align-items-top">
      <div class="mr-1 ${cssTextClass}">${check}</div>
      <div class="flex-grow-1 mx-2">
        <div class="${cssTextClass}"><strong>${ details.title }</strong></div>
        ${ result.message ? `<div class="my-1">${result.message}</div>` : '' }
      </div>
      <div class="text-muted">score ${result.score}</div>
    </div>
  </div>
  `;
}

function renderAuditResults(audits, auditResults) {
  const mapped = Object.keys(auditResults)
    .map((name) => {
      const details = audits[name];
      const result = auditResults[name];
      return { details, result };
    });
  
  // Sort by pass
  mapped.sort((a, b) => b.result.pass - a.result.pass);
  
  return `
<div class="list-group list-group-flush">
  ${renderAll(renderAuditResult, mapped)}
</div>
  `
}

function renderResult(audits, result, index) {
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
      Sidebar
    </div>

    <div class="col-sm-8">

      <div class="card">

        <!-- Tabs -->
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
              <a class="nav-link active" data-toggle="tab" href="#audit-${index}">Audit</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="tab text-muted" href="#json-${index}">JSON</a>
            </li>
          </ul>
        </div>

        <div class="tab-content">

          <!-- Audit -->
          <div class="tab-pane show active" id="audit-${index}">
            ${renderAuditResults(audits, result.results)}
          </div>

          <!-- Raw JSON -->
          <div class="tab-pane" id="json-${index}">
            <div class="card-body">
              ${renderJson({ audits, result })}
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</div>
`;
}

function renderResults(audits, results) {
  return `
<div class="list-group list-group-flush">
  ${renderAll((result, index) => renderResult(audits, result, index), results)}
</div>`
}

module.exports = exports = function renderReport({ audits, results }) {
  return `
  ${renderAudits(audits)}
  ${renderResults(audits, results)}
  `;
}
