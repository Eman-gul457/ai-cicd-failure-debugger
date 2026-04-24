# AI CI/CD Failure Debugger - ReleaseGuard API

ReleaseGuard API is a production-style demo service for the **AI CI/CD Failure Debugger** portfolio project. It models the kind of backend component you would place in front of CI/CD workflows to expose deployment health, release metadata, and validation signals.

## Why this app exists

This is **Step 1** of the broader project. Right now, the service is intentionally focused on clean backend foundations:

- Fastify API with TypeScript
- structured logging with Pino
- environment validation with Zod
- realistic deployment-oriented endpoints
- tests, linting, Docker, and local developer tooling

In later steps, this API will be connected to:

- GitHub Actions for workflow execution and failure signals
- n8n for automation/orchestration
- an AI debugging agent that analyzes CI/CD logs and explains failures

## What it will do later

This service is designed to become the API surface for CI/CD observability and automated debugging flows. Future integrations can:

- ingest pipeline failure summaries
- expose release validation status to automation tools
- attach commit metadata and build artifacts
- trigger AI-assisted failure analysis

## Tech stack

- Node.js
- TypeScript
- Fastify
- Zod
- Pino
- Vitest
- Docker multi-stage build
- Docker Compose
- ESLint + Prettier

## Local setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Start in development mode:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

## Production-style commands

```bash
npm run lint
npm run test
npm run build
npm start
```

## Docker setup

Build and run the service with Docker Compose:

```bash
docker compose up --build
```

The container exposes the app on `http://localhost:3000`.

## API endpoints

### `GET /health`

Returns basic service health details.

Example response:

```json
{
  "status": "ok",
  "service": "releaseguard-api",
  "uptime": 123,
  "timestamp": "2026-04-24T12:00:00.000Z"
}
```

### `GET /ready`

Returns readiness state based on required environment/config availability.

### `GET /version`

Returns app version, runtime environment, and Git SHA metadata.

### `GET /deployments`

Returns mock deployment records with realistic CI/CD fields:

- `id`
- `service`
- `environment`
- `status`
- `commitSha`
- `createdAt`

### `POST /deployments/validate`

Validates a deployment approval payload and returns whether the deployment is approved.

Example request:

```json
{
  "service": "api",
  "environment": "staging",
  "commitSha": "abc123",
  "approvedBy": "devops-user"
}
```

## Tests

Run the test suite with:

```bash
npm run test
```

## Build

Compile the TypeScript project with:

```bash
npm run build
```

## Notes

- No real secrets are included.
- No database or authentication is added yet on purpose.
- The mock deployment data is intentionally static for this first milestone.
