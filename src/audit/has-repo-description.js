const details = {
  title: 'Has a description',
  description: 'Repository should have a good description. Describe what it does.'
}

async function getResults(artefacts) {
  const pass = !!(artefacts.repository.description && artefacts.repository.description !== '');
  return {
    pass,
    score: pass ? 1 : 0,
    message: pass ? null : 'Set a repository description'
  }
}

module.exports = exports = {
  details,
  getResults
}
