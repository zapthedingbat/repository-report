const icons = require("octicons");

function renderDaysAgo(dateStr) {
  const date = new Date(dateStr);
  const msDay = 1000 * 60 * 60 * 24;
  const days = Math.floor((Date.now() - date.getTime()) / msDay);

  if (days === 0) {
    return 'today';
  }

  if (days === 1) {
    return 'yesterday';
  }

  return `${days} days ago`;
}

function renderActivity(repo) {
  return `
  <div class="mb-4">
    <div>Created <strong>${renderDaysAgo(repo.created_at)}</strong></div>
    <div>Pushed to <strong>${renderDaysAgo(repo.pushed_at)}</strong></div>
  </div>
  `;
}

function renderContributor(contributor) {
  return `
  <div class="d-flex justify-content-between align-items-center">
    <img class="mr-1" height="20" width="20" src="${contributor.imageUrl}">
    <a class="flex-grow-1 p-1" href="${contributor.url}">
      ${contributor.title}
    </a>
    <div>
      ${contributor.contributions}
    </div>
  </div>
  `;
}

function renderContributors(contributors) {
  return `
  <div class="mb-4">
    <h5>Contributions</h5>
    ${renderAll(renderContributor, contributors)}
  </div>
  `;
}

function renderRunbook(runbook) {
  return `
  <div>
    <a href="${runbook.url}">
      ${runbook.title}
    </a>
  </div>
  `;
}

function renderRunbooks(runbooks) {

  if (runbooks.length > 0) {
    return `
    <div class="mb-4">
      <h5>Runbooks</h5>
      ${renderAll(renderRunbook, runbooks)}
    </div>
    `;
  } else {
    return `
    <div class="my-2">
      <h5>Runbooks</h5>
      <div class="alert alert-warning mb-2">
        <div>Not Found</div>
        <p class="text-muted">Include a link to the repository in your confluence page.</p>
        <a class="btn btn-secondary btn-sm" href="https://confluence.condenastint.com/pages/createpage-entervariables.action?templateId=65175553&spaceKey=VDP&title=&newSpaceKey=VDP&fromPageId=22251152">Create</a>
      </div>
    </div>
    `;
  }
}

function renderCriteriaResult(result) {
  const check = result.result ? `<span>${icons.check.toSVG()}</span>` : `<span>${icons.x.toSVG()}</span>`;
  return `
  <div class="d-flex flex-row justify-content-between">
    <span class="text-${result.result ? 'success' : 'danger'}">${result.details.title}</span>
    ${check}
  </div>
  `;
}

function renderClassificationCriteriaResult(result) {
  return `
  <div class="list-group-item">
    <div>${result.details.title}</div>
    ${result.criteriaResults.length > 0 ? renderAll(renderCriteriaResult, result.criteriaResults) : `<span class="text-muted">None</span>`}
  </div>
  `;
}

function renderClassification(classification) {

  return `
  <div class="card mb-4 shadow border-${classification.matched.name}">
    <div class="card-body text-${classification.matched.name}">
      <h5 class="card-title">${classification.matched.title}</h5>
      <p>
        ${classification.matched.description}
      </p>
    </div>
  </div>

  <div class="card my-2">
    <div class="list-group list-group-flush">
      ${renderAll(renderClassificationCriteriaResult, classification.classificationCriteriaResults)}
    </div>
  </div>

  `;
}

function renderRepositoryDescription(description) {
  return description
    ? `<div><span class="text-dark py-2">${description}</span></div>`
    : `<div><span class="text-muted py-2">No description set</span></div>`;
}

function renderResults(result) {
  const repo = result.artefacts.repository;
  return `
<div class="list-group-item">

  <div class="my-4">
    <div class="d-flex flex-row justify-content-between">
      <h4 class="flex-grow-1">
        <a href="${repo.html_url}">
          ${repo.name}
        </a>
      </h4>
      <a class="btn btn-light btn-sm" role="button" href="${repo.html_url}/settings" title="settings">
        ${icons.gear.toSVG()} Settings
      </a>
    </div>
    
    ${renderRepositoryDescription(repo.description)}
  </div>

  <div class="row my-4">
    <div class="col-sm-4">
      ${renderActivity(repo)}
      ${renderContributors(result.artefacts.contributors)}
      ${renderRunbooks(result.artefacts.runbooks)}
    </div>
    <div class="col-sm-8">
      ${renderClassification(result.classification)}
    </div>
  </div>
</div>
  `;
}

function renderClassificationSummary(results, classifications) {
  const totalCount = results.length;
  const classificationCounts = classifications.map(classification => {
    let count = results.filter(result => result.classification.matched.name === classification.name).length;
    return Object.assign({}, classification, { count });
  });

  return `
<div class="card-group my-2">
  ${classificationCounts.map(classificationCount => {
    return `
    <div class="card">
      <div class="card-header">
        ${classificationCount.title}
      </div>
      <div class="card-body text-center">
        <span class="card-title display-4 text-nowrap text-${classificationCount.name}">${classificationCount.count}</span>
        <span class="text-muted"><small>${Math.round((classificationCount.count / totalCount) * 100)}%</small></span>
      </div>
    </div>
    `
  }).join('')}
</div>

<div class="progress" style="height: 2.5rem">
  ${classificationCounts.map(classificationCount => {
    const percent = (classificationCount.count / totalCount) * 100;
    return `<div class="progress-bar bg-${classificationCount.name}" role="progressbar" style="width: ${percent}%">${Math.round(percent)}%</div>`
  }).join('')}
</div>
  `
}

function renderResult(result) {
  if (result.results.length === 0) {
    return '<span class="text-muted text-center p-4">No Results</span>';
  }
  // TODO: Pass classifications in as an artefact from the report
  const classifications = result.results[0].classification.classificationCriteriaResults.map(ccr => ccr.details);
  return `
<div class="my-4">
  ${renderClassificationSummary(result.results, classifications)}
</div>

<div class="list-group list-group-flush">
  ${renderAll(renderResults, result.results)}
</div>
`;
}

function withOrganisation(fn, name, url, imageUrl) {
  return function(...args) {
    return `
<div class="container text-center py-4">
  <img src="${imageUrl}" alt="${name}" width="72" height="72">
  <div class="display-4"><a href="${url}">${name}</a></div>
</div>

<div class="border-top border-bottom bg-white py-4">
  <div class="container">
    ${fn(...args)}
  </div>
</div>
`;
  };
}

function withDocument(fn, title) {
  return function(...args) {
    return `<!doctype html>
<html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
      <title>${title}</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
      <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
      <style>
        :root {
          font-size: 14px;
          --operate: #007bff;
          --develop: #17a2b8;
          --create : #28a745;
          --sustain: #ffc107;
          --discard: #343a40;
        }

        .bg-operate { background-color: var(--operate); }
        .bg-develop { background-color: var(--develop); }
        .bg-create  { background-color: var(--create);  }
        .bg-sustain { background-color: var(--sustain); }
        .bg-discard { background-color: var(--discard); }

        .border-operate { border-color: var(--operate); }
        .border-develop { border-color: var(--develop); }
        .border-create  { border-color: var(--create);  }
        .border-sustain { border-color: var(--sustain); }
        .border-discard { border-color: var(--discard); }

        .text-operate { color: var(--operate); }
        .text-develop { color: var(--develop); }
        .text-create  { color: var(--create);  }
        .text-sustain { color: var(--sustain); }
        .text-discard { color: var(--discard); }

      </style>
    </head>
    <body class="bg-light">
      ${fn(...args)}
    </body>
</html>`;
  };
}

function renderAll(fn, ary) {
  return ary.map(fn).join("");
}

function html(writer) {
  return async function generate(results) {
    for (const result of results) {
      // Create rendering function for installation
      const render = withDocument(
        withOrganisation(
          renderResult,
          result.document.title,
          result.document.url,
          result.document.imageUrl
        ),
        result.document.title
      );
      
      // Create a report writer with the installation account name
      const write = writer(result.document.title);

      // Render the report result to the writer 
      await write(render(result));
    }
  };
}

module.exports = exports = html;
