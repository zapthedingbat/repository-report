const name = "Readme length";
const description =
  "Readme file should provide a reasonable amount of information.";

const pattern = /^readme\.md$/i;
const headingPattern = /^\s*#+\s*.+$/gm;
const wordPattern = /\s+/g;

async function audit(artifacts, context) {
  const fileName = artifacts.filePaths.find(filePath => pattern.test(filePath));
  let wordCount = 0;
  if (fileName) {
    const fileContent = await context.readFile(fileName);
    wordCount = fileContent.replace(headingPattern, "").split(wordPattern)
      .length;
  }
  return {
    score: wordCount > 50 ? 1 : 0
  };
}

module.exports = {
  name,
  description,
  audit
};
