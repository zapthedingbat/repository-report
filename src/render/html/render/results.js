const { renderAll, renderJson } = require('./util');
const renderAuditResults = require('./audit-results');
const renderSideBar = require('./side-bar');
const renderRepositorySettingsButton = require('./repository-settings-button');
const renderRepositoryDescription = require('./repository-description');
const renderMaturity = require('./maturity');

function renderResult(audits, result, index) {
  const artefacts = result.artefacts;
  const repository = artefacts.repository;
  const classification = result.classification;
  const auditResults = result.results;
  return `
<div class="list-group-item" id="repo-${repository.title}">

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
      ${renderSideBar(result)}
    </div>

    <div class="col-sm-8">

      <div class="card">

        <!-- Tabs -->
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
              <a class="nav-link active" data-toggle="tab" href="#maturity-${index}">Maturity</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="tab" href="#audit-${index}">Audits</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="tab" href="#json-${index}">JSON</a>
            </li>
          </ul>
        </div>

        <div class="tab-content">

          <!-- Maturity -->
          <div class="tab-pane card-body show active" id="maturity-${index}">
            ${renderMaturity(audits, classification)}
          </div>

          <!-- Audit -->
          <div class="tab-pane" id="audit-${index}">
            ${renderAuditResults(audits, auditResults)}
          </div>

          <!-- Raw JSON -->
          <div class="tab-pane card-body" id="json-${index}">
            \${renderJson({ audits, result })}
          </div>

        </div>

      </div>
    </div>
  </div>
</div>
`;
}

module.exports = exports = function renderResults(audits, results) {
  return `
<div class="list-group list-group-flush">
  ${renderAll((result, index) => renderResult(audits, result, index), results)}
</div>`
}
