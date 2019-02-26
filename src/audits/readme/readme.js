
// The readme file should immediately orient developers to the most important
// aspects of the project. It should make it clear what the project is for, and
// how it can be used
// https://guides.github.com/features/wikis/

function hasReadme(filePaths) {
  
}

function contentLength(content) {
  return readme.split(/\s+/).length;
}

function contentHeadings(content) {
  const headings = readme.match(/^#+\s*(.+)$/g);
}

async function audit(artifacts, context) {
  if (hasReadme(artifacts.filePaths)) {
    const readmeContent = await context.getFileContents('./readme.md');
    contentLength(readmeContent);
    contentHeadings(readmeContent);
  }
}

module.exports = {
  audit
}
