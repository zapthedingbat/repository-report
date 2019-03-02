const renderResultDetails = details => {
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
};

const renderResults = results => results.map(result =>
`<h2>${result.name}</h2>
<p>${result.description}</p>
<div class="repository-report-score">Score: ${result.result.score}</div>
${renderResultDetails(result.result.details)}`
).join('\n');

const render = (repository, results) => `<div class="repository">
<h1 class="repository-name"><a class="repository-link" href="${repository.html_url}">${repository.full_name}</a></h1>
<div class="repository-description">${repository.description}</div>
<div class="repository-reports">
${renderResults(results)}
</div>
</div>`;

module.exports = render;
