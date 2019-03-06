const worker = require("./worker");
const loader = require("./loader");
const createVersionControl = require("./version-control");
const createGatherer = require("./gatherer");
const createAuditor = require("./auditor");

// Get configured version control instance
const versionControl = createVersionControl(process.env.VCS);
const repositories = versionControl.getRepositories();

// Create configured gather
const gatherers = loader("./gather", process.env.GATHER);
const gather = createGatherer(gatherers);

// Create configured auditor
const audits = loader("./audit", process.env.AUDIT);
const auditor = createAuditor(audits);

// Execute worker
worker(repositories, gather, auditor, generateReport);
