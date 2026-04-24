# Tracker 01 — Master Route Atlas

Single source of truth for every route the product exposes (legacy
`src/pages/*`, target `src/routes/*`, public showcase, admin, API).

## Schema

| Path | File | Owner domain | Shell | Auth | Role(s) | Status | Phase | Evidence |
|------|------|--------------|-------|------|---------|--------|-------|----------|

## Conventions

- `Path`: canonical URL, no trailing slash.
- `File`: source file relative to repo root.
- `Shell`: `dashboard`, `marketplace`, `studio`, `admin`, `public`, `auth`.
- `Auth`: `public` / `authed` / `admin`.
- `Status`: Not started / In progress / Verified / Complete.
- `Evidence`: link under `evidence/phase-NN/`.

## Rows

| Path | File | Owner domain | Shell | Auth | Role(s) | Status | Phase | Evidence |
|------|------|--------------|-------|------|---------|--------|-------|----------|
| _Phase 02: canonical atlas + shell ownership locked. 630 distinct paths discovered, 5 shells, 4 real collisions, 7 aliases queued for redirect, 24 splat routes catalogued. Per-route rows are populated by each domain phase using the method in §6 of the audit._ | `src/App.tsx` (legacy) → `src/routes/*` (target) | _all 122 prefixes_ | `public` / `app` / `dashboard` / `ai` / `internal-admin` | mixed | mixed | Verified | 02 | `audits/02-route-atlas.md` |
| `/services/orders` (collision C-1) | `src/App.tsx:803` AND `:1249` | services | `app` | authed | user/professional | In progress | 02 | `audits/02-route-atlas.md#3-path-collisions`, `BLOCKERS.md#B-011` |
| `/services/analytics` (collision C-2) | `src/App.tsx:805` AND `:1251` | services | `app` | authed | user/professional | In progress | 02 | `audits/02-route-atlas.md#3-path-collisions`, `BLOCKERS.md#B-012` |
| `finance` (admin nested, collision C-3) | `src/App.tsx:1013` AND `:1053` | finance | `internal-admin` | admin | admin | In progress | 02 | `audits/02-route-atlas.md#3-path-collisions`, `BLOCKERS.md#B-013` |
| `moderation` (admin nested, collision C-4) | `src/App.tsx:1011` AND `:1073` | moderation | `internal-admin` | admin | admin | In progress | 02 | `audits/02-route-atlas.md#3-path-collisions`, `BLOCKERS.md#B-014` |