
// https://guides.github.com/features/wikis/

const name = 'Has readme file';
const description = 'Project should have a readme file. A Readme file is a way for other users to learn about the project.';
const pattern = /\breadme\.md\b/i;

async function audit(artifacts, context) {
  const hasFile = artifacts.filePaths.some(filePath => pattern.test(filePath));
  return {
    score: hasFile ? 1 : 0
  }
}

module.exports = {
  name,
  description,
  audit
}
