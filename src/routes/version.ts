import type { FastifyPluginAsync } from 'fastify';

import { version } from '../../package.json';
import { env } from '../config/env';

export const versionRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    '/version',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              version: { type: 'string' },
              nodeEnv: { type: 'string' },
              gitSha: { type: 'string' },
            },
            required: ['version', 'nodeEnv', 'gitSha'],
          },
        },
      },
    },
    async () => ({
      version,
      nodeEnv: env.NODE_ENV,
      gitSha: env.GIT_SHA || 'local',
    }),
  );
};
