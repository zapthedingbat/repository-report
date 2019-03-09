const pattern = /(circle.yml$|\.circleci\/config.yml*$|travis.yml$|jenkinsfile$)/i;

const details = {
  title: 'Has continuous integration configuration',
  description: 'Use an automated process to check committed code and detect problems early.'
}

function getResults(artefacts) {
  const filePaths = artefacts['file-paths'];
  const ciFiles = filePaths.filter(filePath => pattern.test(filePath));
  const pass = ciFiles.length > 0;
  if (pass) {
    const fileNames = ciFiles.map(p => p.match(/[^\\/]+$/g)[0]).join(', ');
    const fileCount = ciFiles.length;
    message = `Found ${fileCount > 1 ? `${fileCount} config files`:'a config file'} ${fileNames}`;
  } else {
    message = 'No CI configuration file was found.'
  }

  return {
    pass,
    score: pass ? 1 : 0,
    message
  }
}

module.exports = exports = {
  details,
  getResults
}
