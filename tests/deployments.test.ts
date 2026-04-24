import { afterAll, beforeAll, describe, expect, it } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.SERVICE_NAME = 'releaseguard-api';
process.env.LOG_LEVEL = 'silent';

import { buildApp } from '../src/app';

describe('deployment endpoints', () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns mock deployment records', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/deployments',
    });

    expect(response.statusCode).toBe(200);

    const payload = response.json();

    expect(payload).toHaveLength(3);
    expect(payload[0]).toMatchObject({
      id: expect.any(String),
      service: expect.any(String),
      environment: expect.any(String),
      status: expect.any(String),
      commitSha: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('approves a valid staging deployment request', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/deployments/validate',
      payload: {
        service: 'api',
        environment: 'staging',
        commitSha: 'abc123',
        approvedBy: 'devops-user',
      },
    });

    expect(response.statusCode).toBe(200);

    const payload = response.json();

    expect(payload.approved).toBe(true);
    expect(payload.reasons).toEqual([]);
    expect(payload.deployment.service).toBe('api');
  });

  it('rejects an invalid payload with clear errors', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/deployments/validate',
      payload: {
        service: 'api',
        environment: 'staging',
        commitSha: 'bad',
        approvedBy: '',
      },
    });

    expect(response.statusCode).toBe(400);

    const payload = response.json();

    expect(payload.error).toBe('Bad Request');
    expect(payload.message).toBe('Invalid request payload');
    expect(payload.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'commitSha' }),
        expect.objectContaining({ path: 'approvedBy' }),
      ]),
    );
  });
});
