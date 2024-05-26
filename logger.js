const path = require("path");
const winston = require("winston");

require("winston-daily-rotate-file");

class TimestampFirst {
  constructor(enabled = true) {
    this.enabled = enabled;
  }
  transform(obj) {
    if (this.enabled) {
      return {
        timestamp: Date.now(),
        ...obj
      };
    }
    return obj;
  }
}

const timestampFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD_HH:mm:ss"
  }),
  winston.format.json()
);

const formatTransportType = (type) => {
  return new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, `./logs/%DATE%.log`),
    datePattern: "YYYY-MM-DD",
    level: type,
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.json()
    )
  });
};

const levels = {
  error: 1,
  debug: 0,
  info: 2,
  load: 2
};

const colors = {
  error: "red",
  debug: "yellow",
  info: "green",
  load: "blue"
};

const createLogger = (level) => {
  const logger = winston.createLogger({
    format: timestampFormat,
    level,
    levels,
    transports: [formatTransportType(level)]
  });

  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ colors }),
        winston.format.simple()
      )
    })
  );

  return logger;
};

const error = createLogger("error");
const debug = createLogger("debug");
const info = createLogger("info");
const load = createLogger("load");

module.exports = {
  error: (message, data = {}) => error.error(message, data),
  debug: (message, data = {}) => debug.debug(message, data),
  info: (message, data = {}) => info.info(message, data),
  load: (message, data = {}) => load.load(message, data)
};
