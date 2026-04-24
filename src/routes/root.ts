import type { FastifyPluginAsync } from 'fastify';

import { version } from '../../package.json';
import { env } from '../config/env';

export const rootRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    '/',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              status: { type: 'string' },
              version: { type: 'string' },
              environment: { type: 'string' },
              endpoints: {
                type: 'object',
                properties: {
                  health: { type: 'string' },
                  ready: { type: 'string' },
                  version: { type: 'string' },
                  deployments: { type: 'string' },
                  validateDeployment: { type: 'string' },
                },
                required: ['health', 'ready', 'version', 'deployments', 'validateDeployment'],
              },
            },
            required: ['name', 'status', 'version', 'environment', 'endpoints'],
          },
        },
      },
    },
    async () => ({
      name: env.SERVICE_NAME,
      status: 'online',
      version,
      environment: env.NODE_ENV,
      endpoints: {
        health: '/health',
        ready: '/ready',
        version: '/version',
        deployments: '/deployments',
        validateDeployment: '/deployments/validate',
      },
    }),
  );
};
