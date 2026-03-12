# readiness-model

Date: 2026-03-10

## Endpoints
- Liveness: `/api/health/system`
- Readiness aggregate: `/api/health`
- Dependency details: `/api/health/dependencies`
- Startup diagnostics: `npm run ops:preflight`

## Dependency Policy
- Required:
  - `environment` (required env vars)
  - `database`
  - `settings_store`
  - `audit_trail`
- Optional:
  - `redis`
  - `backup_manifest`

## Status Vocabulary
- `ok`
- `degraded`
- `blocked`
- `not_configured`
- `error`

## Behavior
- `/api/health` and `/api/health/dependencies` both use the shared readiness module (`lib/ops/readiness.js`).
- `/api/health` returns:
  - `200` when overall status is `ok` or `degraded`
  - `503` when overall status is `blocked`
- `/api/health/dependencies` always returns full dependency detail for diagnosis.
- `npm run ops:preflight` prints a terminal-friendly startup summary and exits non-zero when blocked.
