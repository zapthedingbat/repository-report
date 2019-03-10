const Pino = require("pino");

const options = {
  customLevels: {
    trace: 10,
    debug: 20,
    info: 30,
    warning: 40,
    error: 50,
    fatal: 60
  },
  useOnlyCustomLevels: true,
  level: process.env.LOG_LEVEL || "info",
  prettyPrint: process.env.NODE_ENV !== "production",
  name: process.env.npm_package_name
};

const pino = new Pino(options);

module.exports = pino;
