const { renderAll } = require('./util');
const icons = require("./icons-svg")();

function createRenderClassificationHeading(classification) {
  return function renderClassificationHeading(c) {
    let cellCssClass = `text-${c.details.name} `;
    if (classification.matched.name === c.details.name) {
      cellCssClass += `selected selected-${c.details.name} `;
    }
    return `<th scope="col" class="${cellCssClass}">${c.details.title}</th>`;
  }
}

function createRenderCells(auditName, classification) {
  return function renderCells(c) {
    const auditResult = c.auditResults[auditName];
    const pass = auditResult ? auditResult.pass : null;
    let check = '&nbsp;';
    let textCssClass = '';
    let cellCssClass = 'text-center align-middle ';

    if (classification.matched.name === c.details.name) {
      cellCssClass += `selected selected-${c.details.name} `;
    }

    if (typeof pass !== 'boolean') {
      cellCssClass += 'bg-light ';
    }

    if (typeof pass === 'boolean') {
      textCssClass = pass ? 'text-success' : 'text-danger';
      check  = pass ? icons.use('check') : icons.use('x');
    }

    return `
  <td class="${cellCssClass} ${textCssClass}">
    ${check}
  </td>`;
  }
}

function createRenderRows(audits, classification, classifications) {
  return function renderRows(auditName) {
    return `
    <tr>
    <th scope="row">
      <span title="${audits[auditName].description}">
        ${audits[auditName].title}
      </span>
    </th>
    ${renderAll(createRenderCells(auditName, classification), classifications)}
    `
  }
}

module.exports = exports = function renderMaturityMatrix(audits, classification) {
  return `
<div>
  <table class="table table-sm matrix">
    <thead>
      <tr>
        <th></th>
        ${renderAll(createRenderClassificationHeading(classification), classification.classifications)}
      </tr>
    </thead>
    <tbody>
      ${renderAll(createRenderRows(audits, classification, classification.classifications), Object.keys(audits))}
    </tbody>
  </table>
</div>
`
}
