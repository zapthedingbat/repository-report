const name = 'Readme structure';
const description = 'Include helpful topics in the project readme file';

const pattern = /\breadme\.md\b/i;
const headingPattern = /^#+\s*(.+)$/mg;

async function audit(artifacts, context) {
  const fileName = artifacts.filePaths.find(filePath => pattern.test(filePath));
  const fileContent = await context.readFile(fileName);
  const headings = fileContent.match(headingPattern);
  return {
    score: headings.length > 2 ? 1 : 0
  }
}

module.exports = {
  name,
  description,
  audit
}
