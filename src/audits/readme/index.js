const createHasFileAudit = require('./../files/create-has-file-audit');
const readmeLength = require('./readme-length');
const readmeStructure = require('./readme-structure');

module.exports = {
  hasReadme: createHasFileAudit(
    'Has readme',
    'Project should have a readme file. A Readme file is a way for other users to learn about the project.',
    /^readme\.md$/i),
  readmeLength,
  readmeStructure
}
