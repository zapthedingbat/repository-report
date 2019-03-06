const loader = require("./lib/loader");
const createVersionControl = require("./version-control");
const createGatherer = require("./gatherer");
const createAuditor = require("./auditor");
const createReportRenderer = require("./report/renderer");
const reportBuilder = require("./report/builder");

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

// Get configured version control instance
const versionControl = createVersionControl(process.env.VCS);
const repositories = versionControl.getRepositories();

(async () => {
  const writer = async (str, format) => { console.log(str, format); }
  const report = await reportBuilder(repositories, gather, auditor);
  report.frontMatter = {
    title: 'Title',
    url: 'http://www.example.com/',
    imageUrl: 'http://www.example.com/image'
  };
  await render(report, writer);
}) ()
