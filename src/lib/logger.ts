import pino from 'pino';

import { env } from '../config/env';

export const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    service: env.SERVICE_NAME,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
