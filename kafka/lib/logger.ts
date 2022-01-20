import { logLevel } from 'kafkajs';
import winston from 'winston';
import util from 'util';

function inspectObject(obj, enableColors) {
  return util.inspect(obj, {
    showHidden: false,
    depth: null,
    colors: enableColors,
  });
}

function prettyPrinter({ timestamp, level, message, ...rest }) {
  const restClean = Object.entries(rest).reduce((acc, [k, v]) => {
    if (rest.hasOwnProperty(k)) {
      acc[k] = v;
    }
    return acc;
  }, {});

  const restString =
    Object.keys(rest).length !== 0 //
      ? inspectObject(restClean, process.stdout.isTTY === true)
      : '';

  const time = new Date(timestamp).toLocaleTimeString();
  return `[${time}] ${level} - ${message} ${restString}`;
}

const toWinstonLogLevel = (level) => {
  switch (level) {
    case logLevel.ERROR:
    case logLevel.NOTHING:
      return 'error';
    case logLevel.WARN:
      return 'warn';
    case logLevel.INFO:
      return 'info';
    case logLevel.DEBUG:
      return 'debug';
  }
};

export const WinstonLogCreator = (logLevel) => {
  const logger = winston.createLogger({
    level: toWinstonLogLevel(logLevel),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.splat(),
          winston.format.printf(prettyPrinter),
        ),
      }),
      // new winston.transports.Console(),
      // new winston.transports.File({ filename: 'myapp.log' }),
    ],
  });

  return ({ level, log }) => {
    const { message, ...extra } = log;
    logger.log({
      level: toWinstonLogLevel(level),
      message,
      extra,
    });
  };
};
