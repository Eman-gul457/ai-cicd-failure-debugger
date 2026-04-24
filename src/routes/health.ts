import type { FastifyPluginAsync } from 'fastify';

import { env } from '../config/env';

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    '/health',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              service: { type: 'string' },
              uptime: { type: 'number' },
              timestamp: { type: 'string' },
            },
            required: ['status', 'service', 'uptime', 'timestamp'],
          },
        },
      },
    },
    async () => ({
      status: 'ok',
      service: env.SERVICE_NAME,
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    }),
  );
};
