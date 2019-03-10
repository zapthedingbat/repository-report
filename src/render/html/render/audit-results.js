const icons = require("./icons-svg")();

const { renderAll } = require('./util');

function renderAuditResult({ details, result }) {
  const cssTextClass = result.pass ? 'text-success' : 'text-danger';
  const check = result.pass ? icons.use('check') : icons.use('x')
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

module.exports = exports = function renderAuditResults(audits, auditResults) {
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
