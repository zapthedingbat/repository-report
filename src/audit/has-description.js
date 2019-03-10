const details = {
  title: 'Repository has a description',
  description: 'Use the repository description to succinctly tell what it the project intends to do.'
}

function getResults(artefacts) {
  const pass = !!(artefacts.repository.description && artefacts.repository.description !== '');
  return {
    pass,
    score: pass ? 1 : 0,
    message: pass ? null : 'No description was set'
  }
}

module.exports = exports = {
  details,
  getResults
}
