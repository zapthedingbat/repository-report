const headingPattern = /(^\s*#+\s*.+$|^[^\r\n]+={3,}\s*$)/gm;
const wordPattern = /\s+/g;
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
    wordCount = fileContent.replace(headingPattern, "").split(wordPattern).length;
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
