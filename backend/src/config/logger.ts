import { createLogger, format, transports } from 'winston';
import { env } from './env';

const { combine, timestamp, errors, splat, json, printf, colorize } = format;

const developmentFormat = combine(
  colorize({ all: true }),
  timestamp(),
  printf(({ timestamp: time, level, message, ...meta }) => {
    const metadata = Object.keys(meta).length ? ` ${JSON.stringify(meta, null, 2)}` : '';
    return `${time} ${level}: ${message}${metadata}`;
  }),
);

export const logger = createLogger({
  level: env.LOG_LEVEL,
  format: combine(errors({ stack: true }), splat(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: env.NODE_ENV === 'development' ? developmentFormat : combine(timestamp(), json()),
    }),
  ],
  defaultMeta: { service: 'medfinance-backend' },
});
