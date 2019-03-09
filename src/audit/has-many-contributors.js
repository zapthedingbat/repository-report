const details = {
  title: 'Has more than one contributor',
  description: 'Projects are strongest when they are a collaborative effort.'
}

function getResults(artefacts) {
  const pass = !!(artefacts.contributors.length > 1);
  let message;
  switch(artefacts.contributors.length){
    case 0: message = 'There are no contributors';
      break;
    case 1: message = 'There is only one contributor';
      break;
    default: message = `There are ${artefacts.contributors.length} contributors`;
      break;
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
