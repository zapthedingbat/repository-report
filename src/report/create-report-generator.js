function createReportGenerator(writer, renderer) {
  return function reportGenerator(repository, results) {
    const str = renderer(repository, results);
    return writer(str);
  }
}

module.exports = createReportGenerator;
