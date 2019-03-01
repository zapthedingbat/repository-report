const fs = require('fs');
const path = require('path');
const github = require('./github');
const createReportGenerator = require("./report/create-report-generator");
const renderHtml = require("./report/render-html");
const processInstallationRepositories = require("./installation");
const logger = require('./logger');

// Load github app key
const keyPath = path.join(__dirname, '../.keys/github-private-key.pem');

async function worker() {
  const appId = process.env.GITHUB_APP_IDENTIFIER;
  const owner = process.env.GITHUB_OWNER;
  const key = fs.readFileSync(keyPath);
  const appToken = await github.getAppToken(key, appId);
  const installations = await github.getInstallations(appToken);

  // Log installations
  if (logger.isLevelEnabled('debug')) {
    logger.debug(installations, 'installations');
  } else {
    const obj = installations.map(installation => `${installation.account.login} (${installation.repository_selection})`);
    logger.info(obj, 'installations');
  }

  const stdOutWriter = (str) => {
    // process.stdout.write(str)
  };
  for (const installation of installations) {
    const generateReport = createReportGenerator(stdOutWriter, renderHtml);
    await processInstallationRepositories(installation, owner, appToken, generateReport);
  }
};

module.exports = worker;
