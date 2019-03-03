function document(fn, title) {
  return function (...args) {
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
  }
}

function scoreClass(score) {
  if (score === 0) {
    return "danger";
  }

  if (score === 1) {
    return "success";
  }

  return "warning";
}

function badge(score) {
  return `
  <span title="Score: ${score}" class="badge badge-pill badge-${scoreClass(score)}">${score}</span>
  `;
}

function renderRepositoryResult(result) {
  return `
  <li class="list-group-item flex-column">
    <div class="d-flex justify-content-between align-items-center">
      <h6 class="text-${scoreClass(result.result.score)}">${result.name}</h6>
      ${badge(result.result.score)}
    </div>
    <p>${result.description}</p>

    <div>
      ${renderRepositoryResultDetails(result.result.details)}
    </div>
  </li>
  `;
}

function renderRepositoryResultDetails(details) {
  if (!details) {
    return '';
  }
  if (details.items && details.items.length > 0) {
    const keys = Object.keys(details.items[0]);
    return `<table class="repository-report-details">
    <tr>${keys.map(key => `<th>${key}</th>`).join('')}</tr>
    ${details.items.map(item => `<tr>${keys.map(key => `<td>${item[key]}</td>`).join('')}</tr>`).join('')}
    </table>`;
  }
}

function renderRepositoryResultsSummary(results) {
  const total = results.reduce((p, result) => p + result.result.score, 0);
  const score = (total / results.length);
  return `
  <div class="flex-column">
    <div class="d-flex justify-content-between align-items-center">
      <h6 class="text-${scoreClass(score)}">Score</h6>
      ${badge(score)}
    </div>
  </div>
  `;
}

function renderRepositoryLanguage(language) {
  return language ? language : `<span class="text-muted">No language detected</span>`;
}

function renderDateDays(dateStr) {
  const date = new Date(dateStr);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dtf = new Intl.DateTimeFormat('en-US', options);
  const displayDate = dtf.format(date);

  // RelativeTimeFormat not available in Nodejs yet
  const msDay = 1000 * 60 * 60 * 24;
  const days = Math.floor((Date.now() - date.getTime()) / msDay);
  return  `${displayDate} <span class="text-muted">(${days} days ago)</span>`;
}

function renderRepositoryDetails(repo) {
  return `
  <dl class="row">

    <dt class="col-sm-3">Created<dt>
    <dd class="col-sm-9">${renderDateDays(repo.created_at)}</dd>

    <dt class="col-sm-3">Most recent push<dt>
    <dd class="col-sm-9">${renderDateDays(repo.pushed_at)}</dd>

    <dt class="col-sm-3">Language<dt>
    <dd class="col-sm-9">${renderRepositoryLanguage(repo.language)}</dd>

    <dt class="col-sm-3">Size<dt>
    <dd class="col-sm-9">${repo.size}</dd>

    <dt class="col-sm-3">Stargazers<dt>
    <dd class="col-sm-9">${repo.stargazers_count}</dd>

    <dt class="col-sm-3">Watchers<dt>
    <dd class="col-sm-9">${repo.watchers_count}</dd>

    <dt class="col-sm-3">Issues<dt>
    <dd class="col-sm-9">${repo.has_issues}</dd>

    <dt class="col-sm-3">Projects<dt>
    <dd class="col-sm-9">${repo.has_projects}</dd>

    <dt class="col-sm-3">Downloads<dt>
    <dd class="col-sm-9">${repo.has_downloads}</dd>

    <dt class="col-sm-3">Wiki<dt>
    <dd class="col-sm-9">${repo.has_wiki}</dd>

    <dt class="col-sm-3">Pages<dt>
    <dd class="col-sm-9">${repo.has_pages}</dd>

    <dt class="col-sm-3">Forks<dt>
    <dd class="col-sm-9">${repo.forks_count}</dd>

    <dt class="col-sm-3">Mirror<dt>
    <dd class="col-sm-9">${repo.mirror_url}</dd>

    <dt class="col-sm-3">Archived<dt>
    <dd class="col-sm-9">${repo.archived}</dd>

    <dt class="col-sm-3">Open issues<dt>
    <dd class="col-sm-9">${repo.open_issues_count}</dd>

    <dt class="col-sm-3">Watchers<dt>
    <dd class="col-sm-9">${repo.watchers}</dd>

    <dt class="col-sm-3">Default branch<dt>
    <dd class="col-sm-9">${repo.default_branch}</dd>
  </dl>`;
}

function renderRepositoryDescription(description) {
  return description ? `<p>${description}</p>` : `<p class="text-muted">No description set</p>`;
}

function renderRepository(repository, index) {
  const repo = repository.repository;
  const results = repository.results;
  return `
  <div class="repository card w-100 my-1">
    <!--
    <div class="card-header">
      
    </div>
    -->
    <div class="card-body">
      <h3 class="card-title">
        <a class="repository-link" href="${repo.html_url}">
        ${repo.name}
        </a>
      </h3>
      <blockquote class="blockquote card-subtitle">
        ${renderRepositoryDescription(repo.description)}
      </blockquote>

      <a data-toggle="collapse" href="#repository-details-${index}" role="button" aria-expanded="false">Details</a>
      <div class="collapse" id="repository-details-${index}">
        ${renderRepositoryDetails(repo)}
      </div>
      <div>
        ${renderRepositoryResultsSummary(results)}
      </div>
    </div>
    <div class="list-group list-group-flush" id="repository-results-${index}">
      ${renderAll(renderRepositoryResult, results)}
    </div>
  </div>`;
}

function totalScore(results) {
  const total = results.reduce((p, result) => p + result.result.score, 0);
  return (total / results.length);
}

function sortByTotalScore(repoA, repoB) {
  const scoreA = totalScore(repoA.results);
  const scoreB = totalScore(repoB.results);
  return scoreA - scoreB;
}

function renderResult(result) {

  // Order repositories by score
  const orderedRepos = result.repositories.sort(sortByTotalScore);

  return `
  <div class="installation">
    <div class="py-5 text-center">
        <img class="d-block mx-auto mb-4" src="${result.installation.account.avatar_url}" alt="" width="72" height="72">
        <h1 class="display-4"><a href="${result.installation.account.html_url}">${result.installation.account.login}</a></h1>
        <p class="lead">
          <!-- Summary lead -->
        </p>
        <p>
          Installation: ${result.installation.created_at}
        </p>
    </div>
    <div class="row">
      ${renderAll(renderRepository, orderedRepos)}
    </div>
  </div>`;
}

function renderAll(fn, ary) {
  return ary.map(fn).join('');
}

function html(writer, appId, owner) {
  return async function generate(results) {
    for (result of results) {
      const write = writer(result.installation.account.login);
      const render = document(renderResult, result.installation.account.login);
      await write(render(result));
    }
  }
}

module.exports = exports = html;
