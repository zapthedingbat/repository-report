const fs = require("fs");
const path = require("path");
const github = require("./github");
const generateReports = require("./report");

const auditInstallation = require("./installation");

// Load github app key
const keyPath = path.join(__dirname, "../.keys/github-private-key.pem");

async function worker() {
  const appId = process.env.GITHUB_APP_IDENTIFIER;
  const key = fs.readFileSync(keyPath);
  const appToken = await github.getAppToken(key, appId);
  const installations = await github.getInstallations(appToken);

  const results = [];
  for (const installation of installations) {
    const auditResults = await auditInstallation(installation, appToken);
    results.push({
      document: {
        // TODO: Abstract this form github models
        title: installation.account.login,
        url: installation.account.html_url,
        imageUrl: installation.account.avatar_url
      },
      results: auditResults
    });
  }

  await generateReports(results);
}

module.exports = worker;
