function createHasFileAudit(name, description, pattern) {
  async function audit(artifacts) {
    const hasFile = artifacts.filePaths.some(filePath => pattern.test(filePath));
    return {
      score: hasFile ? 1 : 0
    }
  }

  return {
    name,
    description,
    audit
  }
}

module.exports = createHasFileAudit;
