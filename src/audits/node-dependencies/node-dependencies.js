async function audit(artifacts, context) {
  const packageFilePath = artifacts.filePaths.find(p => p.endsWith('package.json'));
  if(packageFilePath){
    const packageFileContents = await context.readFile(packageFilePath);
    const packageJson = JSON.parse(packageFileContents);
    const dependencies = Object.getOwnPropertyNames(Object.assign(
      {},
      packageJson.dependencies,
      packageJson.devDependencies,
      packageJson.peerDependencies,
      packageJson.bundledDependencies,
      packageJson.optionalDependencies,
      packageJson.engines
    ));
    return {
      name: packageJson.name,
      dependencies
    }
  } else {
    // package.json missing. Not a node code-base?
    return null;
  }
}

module.exports = {
  audit
}
