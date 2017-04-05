import winston from 'winston';
import { config } from '../../config/application-config';

let logger2 = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)()
  ]
});

// logger dev and production config
if (config.get('env') === 'development') {
  logger2 = new(winston.Logger)({
    transports: [
      new(winston.transports.Console)()
    ]
  });
} else if (config.get('env') === 'production') {
  logger2 = new(winston.Logger)({
    transports: [
      new(winston.transports.Console)({
        level: 'error'
      }),
      new(winston.transports.File)({
        filename: config.get('logs')
      })
    ]
  });
}

export const logger = logger2;
