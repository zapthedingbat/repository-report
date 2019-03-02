const fs = require('fs');
const path = require('path');
const github = require('./github');
const createReportGenerator = require("./report/create-report-generator");
const renderHtml = require("./report/render-html");

const processInstallationRepositories = require("./installation");
const logger = require('./logger');

// Load github app key
const keyPath = path.join(__dirname, '../.keys/github-private-key.pem');

async function worker(createWriter) {
  const appId = process.env.GITHUB_APP_IDENTIFIER;
  const owner = process.env.GITHUB_OWNER;
  const key = fs.readFileSync(keyPath);
  const appToken = await github.getAppToken(key, appId);
  const installations = await github.getInstallations(appToken);
  
  // Log installations
  if (logger.isLevelEnabled('debug')) {
    logger.debug(installations, 'processing installations');
  } else {
    const obj = installations.map(installation => `${installation.account.login} (${installation.repository_selection})`);
    logger.info(obj, 'processing installations');
  }

  for (const installation of installations) {
    const writer = createWriter(installation.account.login);
    const generateReport = createReportGenerator(writer, renderHtml);
    await processInstallationRepositories(installation, owner, appToken, generateReport);
  }
};

module.exports = worker;
