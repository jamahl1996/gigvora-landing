---
name: Domain code never lives in Lovable Cloud / Supabase
description: All enterprise domain code (NestJS modules, Drizzle schemas, Python ML/analytics, Flutter, SDK, frontend pages) must live in the codebase under apps/ packages/ src/. Supabase project is reserved for the unrelated DailyMint habits demo only.
type: constraint
---

**Rule:** No code or schema for any Gigvora enterprise domain (Domains 02–N
in `.lovable/hardening-plan.md`) may be stored in the Supabase project, in
`supabase/migrations/`, in Supabase Edge Functions, in Supabase Storage, or
in any Cloud-hosted runtime owned by Lovable's managed Supabase. Every file
must live in the user's source tree, specifically:

| Layer | Codebase location |
|---|---|
| NestJS modules | `apps/api-nest/src/modules/<domain>/` |
| Drizzle schemas | `packages/db/src/schema/<domain>.ts` |
| Postgres migrations | `packages/db/migrations/<NNNN>_<domain>.sql` |
| Python ML | `apps/ml-python/app/<domain>.py` |
| Python analytics | `apps/analytics-python/app/<domain>.py` |
| Flutter screens | `apps/mobile-flutter/lib/features/<domain>/` |
| SDK namespace | `packages/sdk/src/index.ts` (typed namespace per domain) |
| Web pages | `src/pages/<domain>/` (and TanStack `src/routes/` once migrated) |
| Playwright tests | `tests/playwright/<domain>.spec.ts` |
| Architecture doc | `docs/architecture/domain-NN-<domain>.md` |

**Why:** the user explicitly forbids enterprise domain artifacts being held
in Lovable Cloud / Supabase. The Supabase project attached to this Lovable
workspace is intentionally limited to the unrelated DailyMint habit-tracker
demo (tables: `habits`, `habit_logs`, `profiles`). Domain Postgres lives
in the user's own Postgres (DATABASE_URL) reached via `packages/db` Drizzle
migrations — never via `supabase migration` tooling.

**How to apply:**
1. NEVER call `supabase--migration` for an enterprise domain. Always emit
   plain `.sql` files into `packages/db/migrations/`.
2. NEVER place secrets, edge functions, or storage buckets for enterprise
   domains in Supabase. Use `apps/api-nest` config + the user's own
   provider connections.
3. If a generated artifact accidentally lands in `supabase/`, move it into
   the correct codebase location in the same turn and delete the Supabase
   copy.
4. Audit: see `docs/architecture/domain-storage-audit.md` for the live map.
