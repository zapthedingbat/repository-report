const path = require('path');
const writeFiles = require('./report/write-files');
const render = require("./report/render-html");

const writerFactory = writeFiles(path.join(__dirname, '../.reports'), 'html');

require('./worker')(
  writerFactory,
  render
);
