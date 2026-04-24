import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

import { deploymentRecords } from '../data/deployments';

const deploymentValidationSchema = z.object({
  service: z.enum(['api', 'worker', 'web']),
  environment: z.enum(['staging', 'production']),
  commitSha: z
    .string()
    .trim()
    .min(6, 'commitSha must be at least 6 characters long')
    .max(40, 'commitSha must be at most 40 characters long')
    .regex(/^[a-fA-F0-9]+$/, 'commitSha must be a valid hexadecimal Git SHA'),
  approvedBy: z.string().trim().min(3, 'approvedBy must be at least 3 characters long'),
});

export const deploymentsRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    '/deployments',
    {
      schema: {
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                service: { type: 'string' },
                environment: { type: 'string' },
                status: { type: 'string' },
                commitSha: { type: 'string' },
                createdAt: { type: 'string' },
              },
              required: ['id', 'service', 'environment', 'status', 'commitSha', 'createdAt'],
            },
          },
        },
      },
    },
    async () => deploymentRecords,
  );

  app.post(
    '/deployments/validate',
    {
      schema: {
        body: {
          type: 'object',
          required: ['service', 'environment', 'commitSha', 'approvedBy'],
          properties: {
            service: { type: 'string' },
            environment: { type: 'string' },
            commitSha: { type: 'string' },
            approvedBy: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              approved: { type: 'boolean' },
              reasons: {
                type: 'array',
                items: { type: 'string' },
              },
              deployment: {
                type: 'object',
                properties: {
                  service: { type: 'string' },
                  environment: { type: 'string' },
                  commitSha: { type: 'string' },
                  approvedBy: { type: 'string' },
                },
                required: ['service', 'environment', 'commitSha', 'approvedBy'],
              },
            },
            required: ['approved', 'reasons', 'deployment'],
          },
        },
      },
    },
    async (request) => {
      const payload = deploymentValidationSchema.parse(request.body);
      const reasons: string[] = [];

      if (payload.environment === 'production' && !payload.approvedBy.startsWith('ops-')) {
        reasons.push('Production deployments must be approved by an ops-* reviewer.');
      }

      return {
        approved: reasons.length === 0,
        reasons,
        deployment: payload,
      };
    },
  );
};
