import Fastify, { type FastifyError } from 'fastify';
import type { ZodError } from 'zod';

import { env } from './config/env';
import { logger } from './lib/logger';
import { deploymentsRoutes } from './routes/deployments';
import { healthRoutes } from './routes/health';
import { readyRoutes } from './routes/ready';
import { rootRoutes } from './routes/root';
import { versionRoutes } from './routes/version';

const isZodError = (error: unknown): error is ZodError => {
  return typeof error === 'object' && error !== null && 'name' in error && error.name === 'ZodError';
};

export const buildApp = () => {
  const app = Fastify({
    ...(env.NODE_ENV === 'test' ? { logger: false } : { loggerInstance: logger }),
    disableRequestLogging: env.NODE_ENV === 'test',
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, 'request failed');

    if (isZodError(error)) {
      reply.status(400).send({
        error: 'Bad Request',
        message: 'Invalid request payload',
        details: error.issues.map((issue) => ({
          path: issue.path.join('.') || 'body',
          message: issue.message,
        })),
      });
      return;
    }

    const fastifyError = error as FastifyError;
    const statusCode =
      fastifyError.statusCode && fastifyError.statusCode >= 400 ? fastifyError.statusCode : 500;

    reply.status(statusCode).send({
      error: statusCode >= 500 ? 'Internal Server Error' : fastifyError.name,
      message: fastifyError.message,
    });
  });

  app.register(rootRoutes);
  app.register(healthRoutes);
  app.register(readyRoutes);
  app.register(versionRoutes);
  app.register(deploymentsRoutes);

  return app;
};
