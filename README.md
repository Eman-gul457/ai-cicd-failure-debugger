# AI CI/CD Failure Debugger - ReleaseGuard API

[![ReleaseGuard CI](https://github.com/Eman-gul457/ai-cicd-failure-debugger/actions/workflows/ci.yml/badge.svg)](https://github.com/Eman-gul457/ai-cicd-failure-debugger/actions/workflows/ci.yml)

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

## CI/CD

The project now includes a GitHub Actions pipeline defined in `.github/workflows/ci.yml`. On every push to `main`, every pull request targeting `main`, and every manual workflow dispatch, the pipeline runs the core quality gates for the ReleaseGuard API.

The CI workflow checks:

- dependency installation with `npm ci`
- code quality with `npm run lint`
- automated tests with `npm run test`
- production build compilation with `npm run build`
- container build verification with `docker build -t releaseguard-api:ci .`

This is the first CI/CD layer for the AI CI/CD Failure Debugger project. In later steps, the pipeline results and logs will be connected to n8n orchestration and AI-powered CI failure analysis, but no n8n webhook or log-debugging automation is added yet.

## Demo Failure Workflow

The main CI workflow stays green and continues to protect the normal development flow. A separate manual-only workflow is available at `.github/workflows/demo-failure.yml` for safe failure simulation.

The demo failure workflow is triggered only with `workflow_dispatch`, so it does not affect regular pushes or pull requests. It runs the same install, lint, test, and build steps as the normal pipeline, then intentionally fails on `npm run build:production` to create realistic GitHub Actions failure logs.

Those failure logs are meant for the next stage of this project, where n8n orchestration and the AI CI/CD Failure Debugger will consume CI output and analyze what went wrong.

## n8n Webhook Integration

The demo failure workflow now sends a CI failure payload to n8n after the intentional failure occurs. This keeps the main CI path safe while giving the project a real failure event that can be forwarded into automation.

The webhook URL is stored in the GitHub Actions secret `N8N_CICD_WEBHOOK_URL`, and the workflow sends a shared secret header using `N8N_WEBHOOK_SECRET` for basic protection. No webhook credentials are hardcoded in the repository.

This prepares the next step of the project, where n8n can receive the failure event, fetch the related logs and run metadata, and pass that context into AI-based CI/CD failure analysis.

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
