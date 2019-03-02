const path = require('path');
const writeFiles = require('./report/write-files');

const writerFactory = writeFiles(path.join(__dirname, '../.reports'), 'html');

require('./worker')(
  writerFactory
);
