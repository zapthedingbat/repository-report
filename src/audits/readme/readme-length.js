const name = 'Readme structure';
const description = 'Readme file should provide helpful information about the most important aspects of the project.';

const pattern = /(^|\/)readme\.md$/i;
const wordPattern = /\s+/g;

async function audit(artifacts, context) {
  const fileName = artifacts.filePaths.find(filePath => pattern.test(filePath));
  let wordCount = 0;
  if (fileName) {
    const fileContent = await context.readFile(fileName);
    wordCount = fileContent.split(wordPattern).length;
  }
  return {
    score: wordCount > 50 ? 1 : 0
  }
}

module.exports = {
  name,
  description,
  audit
}
