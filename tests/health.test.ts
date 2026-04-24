import { afterAll, beforeAll, describe, expect, it } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.SERVICE_NAME = 'releaseguard-api';
process.env.LOG_LEVEL = 'silent';

import { buildApp } from '../src/app';

describe('health endpoints', () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns a service overview at the root route', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);

    const payload = response.json();

    expect(payload.name).toBe('releaseguard-api');
    expect(payload.status).toBe('online');
    expect(payload.environment).toBe('test');
    expect(payload.endpoints).toMatchObject({
      health: '/health',
      ready: '/ready',
      version: '/version',
      deployments: '/deployments',
      validateDeployment: '/deployments/validate',
    });
  });

  it('returns service health metadata', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);

    const payload = response.json();

    expect(payload.status).toBe('ok');
    expect(payload.service).toBe('releaseguard-api');
    expect(payload.uptime).toEqual(expect.any(Number));
    expect(payload.timestamp).toEqual(expect.any(String));
  });

  it('returns readiness information', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/ready',
    });

    expect(response.statusCode).toBe(200);

    const payload = response.json();

    expect(payload.ready).toBe(true);
    expect(payload.checks.environment).toBe('ok');
    expect(payload.checks.config).toBe('ok');
  });
});
