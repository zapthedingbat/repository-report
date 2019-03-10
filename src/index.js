#!/usr/bin/env node
const logger = require('./lib/logger');

const worker = require('./worker');
(async () => {
  try {
    logger.trace('start');
    await worker();
  } catch (err) {
    logger.error(err);
  } finally {
    logger.trace('complete');
  }
})();
