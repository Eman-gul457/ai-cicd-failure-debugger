import type { FastifyPluginAsync } from 'fastify';

import { env, requiredEnvKeys } from '../config/env';

export const readyRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    '/ready',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              ready: { type: 'boolean' },
              checks: {
                type: 'object',
                properties: {
                  environment: { type: 'string' },
                  config: { type: 'string' },
                },
                required: ['environment', 'config'],
              },
            },
            required: ['ready', 'checks'],
          },
          503: {
            type: 'object',
            properties: {
              ready: { type: 'boolean' },
              checks: {
                type: 'object',
                properties: {
                  environment: { type: 'string' },
                  config: { type: 'string' },
                },
                required: ['environment', 'config'],
              },
            },
            required: ['ready', 'checks'],
          },
        },
      },
    },
    async (_, reply) => {
      const hasRequiredEnv = requiredEnvKeys.every((key) => {
        const value = env[key];
        return String(value).trim().length > 0;
      });

      const hasValidConfig = Boolean(env.SERVICE_NAME && env.PORT > 0);
      const isReady = hasRequiredEnv && hasValidConfig;

      if (!isReady) {
        reply.code(503);
      }

      return {
        ready: isReady,
        checks: {
          environment: hasRequiredEnv ? 'ok' : 'missing',
          config: hasValidConfig ? 'ok' : 'invalid',
        },
      };
    },
  );
};
