const pattern = /^readme\.md$/i;

module.exports = exports = async function gather(repository) {
  const filePaths = await repository.getFilePaths();
  const filePath = filePaths.find(filePath => pattern.test(filePath));
  if (filePath) {
    return await repository.readFile(filePath);
  }
  return null;
}
