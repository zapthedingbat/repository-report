const headingPattern = /(^#+\s*.+$|^.+[\r\n]+={3,}\s*$)/gm
const wordPattern = /\S+/gm;
const minHeadings = 2;
const minWords = 50;

const details = {
  title: 'Has a helpful readme file',
  description: 'Readme file should provide enough helpful information for someone to start using an contributing to the project.'
}

function getResults(artefacts) {
  const fileContent = artefacts['readme'];

  let pass;
  let message;
  if (fileContent) {
    const headings = fileContent.match(headingPattern) || [];
    const words = fileContent.replace(headingPattern, "").match(wordPattern);
    const wordCount = words ? words.length : 0;
    pass = (headings.length > minHeadings && wordCount > minWords);
    message = `Readme has ${headings.length} headings and ${wordCount} other words.`;
  } else {
    pass = false;
    message = `No readme file was found.`;
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
