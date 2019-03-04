const name = "Readme structure";
const description = "Include helpful topics in the project readme file";

const pattern = /^readme\.md$/i;
const headingPattern = /^#+\s*(.+)$/gm;

async function audit(artifacts, context) {
  const fileName = artifacts.filePaths.find(filePath => pattern.test(filePath));
  let headings = [];
  if (fileName) {
    const fileContent = await context.readFile(fileName);
    headings = fileContent.match(headingPattern) || [];
  }

  return {
    score: headings.length > 2 ? 1 : 0,
    details: {
      items: headings.map(heading => ({ heading }))
    }
  };
}

module.exports = {
  name,
  description,
  audit
};
