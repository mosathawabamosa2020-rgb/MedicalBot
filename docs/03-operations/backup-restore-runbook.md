# backup-restore-runbook

Date: 2026-03-09

## Commands
- Backup: `npm run ops:backup`
- Restore latest (without DB restore): `npm run ops:restore -- --skip-db`
- Restore from a specific backup: `npm run ops:restore -- --from artifacts/backups/<backup-id> --skip-db`

## Notes
- DB SQL backup/restore requires postgres-compatible `DATABASE_URL` and `pg_dump`/`psql` binaries available.
- Manifest is written to `artifacts/backups/<backup-id>/manifest.json`.
