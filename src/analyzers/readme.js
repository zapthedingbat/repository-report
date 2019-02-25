function create(config) {
  // The readme file should immediately orient developers to the most important
  // aspects of the project. It should make it clear what the project is for, and
  // how it can be used
  // https://guides.github.com/features/wikis/
}

function contentLength(content) {
  return readme.split(/\s+/).length;
}

function contentHeadings(content) {
  const headings = readme.match(/^#+\s*(.+)$/g);
}
