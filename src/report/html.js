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

function renderRepositoryDetailsSummary(repo) {
  return `
  <h5>Activity</h5>
  <div>Created <strong>${renderDaysAgo(repo.created_at)}</strong></div>
  <div>Pushed to <strong>${renderDaysAgo(repo.pushed_at)}</strong></div>
  `;
}

function renderCriteriaResult(result, index) {
  return `
  <div>${result.details.title}: ${result.result}</div>
  `;
}

function renderClassificationCriteriaResult(result, index) {
  return `
  <h6>${result.details.title}</h6>
  ${renderAll(renderCriteriaResult, result.criteriaResults)}
  `;
}

function renderRepositoryModelSummary(repo, results) {
  return `
  <h5>Maturity Model</h5>
  <div class="display-4 ${results.matched.name}">${results.matched.title}</div>
  <p>
    ${results.matched.description}
  </p>

  <div>
    ${renderAll(renderClassificationCriteriaResult, results.classificationCriteriaResults)}
  </div>
  `;
}

function renderRepositoryDescription(description) {
  return description
    ? `<p>${description}</p>`
    : `<p class="text-muted">No description set</p>`;
}

function renderRepositoryResult(repositoryResult) {
  return `
  <div class="card w-100 my-2">
  <div class="card-body">
  <pre>${JSON.stringify(repositoryResult, null, 2)}</pre>
  </div>
  </div>`;

  return `
  <div class="card w-100 my-2">
    <div class="card-body">
      <div class="card-title d-flex justify-content-between align-self-center">
        <h2>
          <a class="repository-link" href="${repo.html_url}">
          ${repositoryResult.name}
          </a>
        </h2>
        <a href="${repositoryResult.html_url}/settings" title="settings">${icons.gear.toSVG()}</a>
      </div>
      <blockquote class="blockquote card-subtitle">
        ${renderRepositoryDescription(repositoryResult.description)}
      </blockquote>

      <pre>${JSON.stringify(repositoryResult, null, 2)}</pre>

      <!--
      <div class="row">
        <div class="col-sm-4">
          $renderRepositorySummary(repositoryResult.repository)
        </div>

        <div class="col-sm-8">
          $renderRepositoryModelSummary(repositoryResults)
        </div>
      </div>
      -->
    </div>
  </div>
  `;
}

function renderRepositoryResults(repositoryResults) {
  return renderAll(renderRepositoryResult, repositoryResults);  
}

function withInstallation(fn, installation) {
  return function(...args) {
    return `
  <div class="installation">
    <div class="text-center">
      <img src="${
        installation.account.avatar_url
      }" alt="${installation.account.login}" width="72" height="72">
      <h1 class="display-4"><a href="${
        installation.account.html_url
      }">${installation.account.login}</a></h1>
    </div>
    <div class="row">
      ${fn(...args)}
    </div>
  </div>`;
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
    </head>
    <body class="bg-light">
      <div class="container">
        ${fn(...args)}
      </div>
    </body>
</html>`;
  };
}

function renderAll(fn, ary) {
  return ary.map(fn).join("");
}

function html(writer) {
  return async function generate(installation, repositoryResults) {

    // Create rendering function for installation
    const render = withDocument(withInstallation(renderRepositoryResults, installation), installation.account.login);
    
    // Create a report writer with the installation account name
    const write = writer(installation.account.login);

    // Render the report result to the writer 
    await write(render(repositoryResults, installation));
  };
}

module.exports = exports = html;
