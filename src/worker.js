const loader = require("./lib/loader");
const logger = require("./lib/logger");
const createGatherer = require("./gatherer");
const createAuditor = require("./auditor");
const createReportRenderer = require("./report/renderer");
const createVersionControl = require("./version-control");
const createWriter = require("./lib/file-writer");
const reportBuilder = require("./report/builder");

module.exports = exports = async function worker() { 

  const load = loader(__dirname);

  // Create configured gather
  const gatherers = load('./gather', process.env.GATHER);
  const gather = createGatherer(gatherers);

  // Create configured auditor
  const audits = load('./audit', process.env.AUDIT);
  const auditor = createAuditor(audits);

  // Create configured report renderer
  const renderers = load('./render', process.env.RENDER);
  const render = createReportRenderer(renderers);

  const versionControl = await createVersionControl(process.env.VCS);
  const reportGroups = await versionControl.getReportGroups();

  const writer = createWriter('./.reports');
  for (const reportGroup of reportGroups) {
    logger.info(reportGroup, 'Creating report group');
    
    logger.info({ reportGroup }, 'Getting repositories for report group');
    const repositories = await reportGroup.getRepositories();
    
    logger.info(`Found ${repositories.length} repositories`);
    
    logger.info('Building reports');
    const report = await reportBuilder(repositories, gather, auditor);
    
    logger.info('Rendering reports');
    await render(reportGroup, report, writer);
  }
}
