const details = {
  title: 'Is linked to from confluence',
  description: 'A runbook should link to the repository.'
}

function getResults(artefacts) {
  const linkedPages = artefacts['confluence-linked-pages'];
  const pass = !!(linkedPages.length > 0);
  let message;
  switch(linkedPages.length){
    case 0: message = 'There are no links from confluence';
      break;
    case 1: message = 'There is a link from confluence';
      break;
    default: message = `There are ${linkedPages.length} links from confluence`;
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
