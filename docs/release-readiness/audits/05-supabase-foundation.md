# Phase 05 — Supabase foundation, environments, and migration discipline

Captured: 2026-04-23. Source of truth for: which Supabase project we use,
who may write to it, how secrets flow, and how migrations are governed.

## 1. Project topology

Gigvora has **two distinct backend planes**. Confusing them is the single
most expensive mistake a contributor can make.

| Plane | Owner | Holds | Tooling |
|-------|-------|-------|---------|
| **Lovable Cloud — managed Supabase** (this project) | Lovable workspace | Web shell auth, AI Gateway edge fn (`ai-assistant`), and the **DailyMint demo schema only** | `supabase--migration` MCP tool, Lovable Cloud UI |
| **Gigvora enterprise Postgres** | User's own infra (api-nest + Drizzle) | All 28 enterprise domains (identity, marketplace, hire, finance, …) | `packages/db` Drizzle schemas + `packages/db/migrations/*.sql` (NEVER `supabase migration`) |

This split is mandated by `mem://tech/no-domain-code-in-supabase`. Phase 05
formalises the rule in the tracker system; subsequent phases must respect it.

### Project identifiers

| Field | Value |
|-------|-------|
| Lovable project ID  | `cab70c44-c7bb-42f6-a1db-bc545186a71d` |
| Supabase project ref (managed) | `ehcwxqvypxmmtwkcjajw` |
| Supabase URL        | `https://ehcwxqvypxmmtwkcjajw.supabase.co` |
| Supabase region     | inherited from Lovable Cloud (managed; not user-configurable) |
| Project naming      | `gigvora-web` (Lovable side) — DO NOT rename; it is referenced by the publish URL `gigvora.lovable.app` |

## 2. Environment separation policy

We operate **three logical environments** but only the first two have a
dedicated Supabase project today:

| Env  | Backend                            | Web URL                                          | Purpose |
|------|------------------------------------|--------------------------------------------------|---------|
| dev  | Lovable Cloud Test instance        | `id-preview--<projectId>.lovable.app`            | live preview while building |
| prod | Lovable Cloud Live instance        | `gigvora.lovable.app` + custom domains           | published site for real users |
| local| Optional local Postgres + Drizzle  | `http://localhost:5173`                           | enterprise domain work via `packages/db` only |

**Rule:** code MUST NOT branch on `NODE_ENV` to switch *backend* — both
Lovable instances point at distinct Supabase projects, so the same code +
the same `import.meta.env.VITE_SUPABASE_URL` (different at build-time per
environment) is sufficient. Any conditional that says
`if (NODE_ENV === 'production') useDifferentSupabase()` is a bug — file it
as a blocker.

## 3. Secrets discipline

### Runtime secrets registry (managed by `supabase--add_secret` / `secrets--fetch_secrets`)

| Name                         | Plane   | Used by                                      | Rotation |
|------------------------------|---------|----------------------------------------------|----------|
| `SUPABASE_URL`               | server  | `client.server.ts`, edge fns                 | platform (Lovable) |
| `SUPABASE_PUBLISHABLE_KEY`   | both    | `client.ts` (browser), `client.server.ts`    | platform (Lovable) |
| `SUPABASE_SERVICE_ROLE_KEY`  | server  | `client.server.ts` only — NEVER in `src/components/**` | rotate via `supabase--rotate_api_keys` if leaked |
| `SUPABASE_DB_URL`            | server  | one-off DB scripts; not referenced from app  | platform |
| `LOVABLE_API_KEY`            | server  | `supabase/functions/ai-assistant/index.ts` and any future AI server fn | rotate via `ai_gateway--rotate_lovable_api_key` ONLY |

### Build-time vars (shipped to browser by Vite)

`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`.
Auto-injected by Lovable Cloud — `.env` is read-only and managed by the
platform. Do NOT edit it manually.

### Hard rules

1. Service-role key MUST NOT appear under `src/components/**`,
   `src/hooks/**`, `src/pages/**`, `src/routes/**`. Enforced by lint sweep
   in Phase 14 (security tracker row added).
2. Never commit a secret to git (the `.env` only holds the publishable
   key + URL, which are public by design).
3. New secrets are added through `secrets--add_secret`, never typed by the
   user into chat.
4. Rotation: any compromised key triggers `supabase--rotate_api_keys`
   immediately, then a sweep through `git log` to confirm no leakage.

## 4. Auth provider plan

Default for Phase auth (deferred to a dedicated phase):

- **Email + password** (always on)
- **Google sign-in** via Lovable's managed OAuth (zero-config)
- **No anonymous sign-up** (enforced via `supabase--configure_auth`)
- **No auto-confirm email** unless explicitly requested (matches policy
  in `<supabase-changes>`)
- **HIBP password check** ON (`password_hibp_enabled: true`)

Not enabled in Phase 05 — only the *plan* is recorded so the auth phase
can implement it without re-litigating the choice.

## 5. Client / server boundary

| File                                              | Plane   | Imports OK from |
|---------------------------------------------------|---------|-----------------|
| `src/integrations/supabase/client.ts`             | browser | any component / page / route / hook |
| `src/integrations/supabase/client.server.ts`      | server  | server fns (`createServerFn`), server route handlers (`/app/routes/api/**`), edge fns |
| `src/integrations/supabase/auth-middleware.ts`    | server  | server fns that need authenticated user context |
| `src/integrations/supabase/types.ts`              | both    | type-only imports anywhere |
| `src/lib/env.ts` (new in Phase 05)                | both    | `clientEnv` from anywhere; `loadServerEnv()` from server only |

The **only** sanctioned way to read `import.meta.env.*` or
`process.env.SUPABASE_*` going forward is via `src/lib/env.ts`.
Direct reads in feature code are a Phase-05 blocker (B-031).

## 6. Migration discipline

### For the Lovable-managed Supabase project (this project)

- Every schema change goes through `supabase--migration` (not raw SQL files).
- Migrations stored in `supabase/migrations/<timestamp>_<slug>.sql` are
  **read-only** to the agent (cannot be edited; only superseded by a new
  timestamped file).
- `supabase/config.toml` is auto-generated. Only function-specific blocks
  (e.g. `verify_jwt = false` for an edge fn) may be appended; project-level
  settings stay untouched.
- Every migration MUST include RLS for any new table. **No exceptions.**

### For the enterprise Postgres (apps/api-nest + packages/db)

- Drizzle schemas live in `packages/db/src/schema/<domain>.ts`.
- SQL migrations live in `packages/db/migrations/<NNNN>_<domain>.sql`.
- `supabase--migration` MUST NOT be used for enterprise domains. If a
  migration accidentally lands in `supabase/migrations/`, move it and
  delete the Supabase copy in the same turn.

### Approval gate

Migrations are approved by the user via the Lovable migration approval
flow (the `supabase--migration` tool stages a migration; the user clicks
approve before it executes). The agent MUST NOT call further code-edit
tools in the same batch as a migration — they are mutually exclusive.

## 7. Edge function plan

Today: **1 edge function** in `supabase/functions/ai-assistant/`.

Phase 05 adds zero new edge functions. The plan: every edge fn must be
listed in `trackers/07-edge-functions-cron.md` with its purpose, secrets
consumed, schedule (if any), and `verify_jwt` setting. Population starts
in subsequent domain phases.

## 8. Storage plan

Today: **0 buckets** in the managed project. All Gigvora media will land
in the user's own S3 reached via the api-nest media-pipeline (per
`docs/architecture/supabase-removal.md` §Storage). The managed Supabase
storage layer remains available for any UI demo but is NOT the canonical
media store. Tracker `08-storage-buckets.md` carries this clarification.

## 9. Realtime plan

Today: **0 subscriptions** (per tracker 09 baseline). Future realtime
work goes through Socket.IO in api-nest, not Supabase Realtime. Any
Supabase Realtime subscription added MUST be flagged for migration in
the same PR.

## 10. Verification

```bash
# 1. Confirm env validation file exists and is the only consumer of VITE_SUPABASE_*
test -f src/lib/env.ts && echo OK
grep -rln "import.meta.env.VITE_SUPABASE_" src --include="*.ts" --include="*.tsx" \
  | grep -v "src/integrations/supabase/client.ts" \
  | grep -v "src/lib/env.ts"
# expected: empty (any other match is a Phase 05 blocker — B-031)

# 2. Confirm service-role key is referenced only in client.server.ts
grep -rln "SUPABASE_SERVICE_ROLE_KEY" src --include="*.ts" --include="*.tsx" \
  | grep -v "src/integrations/supabase/client.server.ts" \
  | grep -v "src/lib/env.ts"
# expected: empty

# 3. Confirm no enterprise schema accidentally lives under supabase/migrations
ls supabase/migrations/
# expected: only DailyMint demo migrations, no Gigvora domain SQL
```

## 11. Summary counters

| Metric                                           | Before | After |
|--------------------------------------------------|-------:|------:|
| Documented Supabase planes                       | 1      | 2 (managed + enterprise) |
| Centralised env-validation files                 | 0      | 1 (`src/lib/env.ts`) |
| Documented runtime secrets                       | 5 (raw list) | 5 (with plane + rotation policy) |
| Documented environments (dev / prod / local)     | 0      | 3 |
| Documented migration governance for both planes  | partial| explicit |
| New blockers                                     | —      | 4 (B-031 → B-034) |