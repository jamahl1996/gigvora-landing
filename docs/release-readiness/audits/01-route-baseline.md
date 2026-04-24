# Phase 01 — Repo Baseline Audit

Captured: 2026-04-23. Source: `find` + `grep` over `src/` at HEAD.

## Headline counts

| Metric                                              | Count |
|-----------------------------------------------------|-------|
| Files under `src/routes/` (TanStack Start)          | 0     |
| Files under `src/pages/` (legacy SPA)               | 614   |
| `<Button>` / `<button>` usages in `src/pages` + `src/components` | 4,670 |
| Real form surfaces (`useForm(` or `<form `)         | 12    |
| Zod usages (`from 'zod'` or `z.object(`)            | 0     |
| Supabase realtime channel subscriptions             | 0     |
| `RTCPeerConnection` constructions                   | 0     |

## Supabase backend

- `public.*` tables: **0** (per `<supabase-tables>` block at audit time).
- Storage buckets: **0**.
- Edge functions deployed: 1 assumed by audit (unverified).
- Database functions / triggers: **0**.
- Existing secrets: `LOVABLE_API_KEY`, `SUPABASE_URL`,
  `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
  `SUPABASE_DB_URL`.

## Implications for the 40-phase plan

- The product UI surface is large (~614 pages, ~4.6k buttons) but the
  data layer is empty. Phases 02–10 must therefore **schema-first**:
  build Supabase tables + RLS before wiring buttons.
- Architecture is still on the legacy `src/pages/*` SPA shell. The
  `<technology-stack>` brief mandates TanStack Start (`src/routes/*`).
  This is recorded as **B-008** and will be addressed in a dedicated
  phase before any new routed surface is added.
- Validation is non-existent (0 Zod). All new forms in subsequent
  phases MUST land with a Zod schema referenced from
  `trackers/05-form-field-validation.md`.
- Realtime, WebRTC, and storage are all greenfield — they get their own
  trackers (09, 12, 08) and dedicated phases.

## Snapshot commands (for reproduction)

```bash
find src/routes -type f \( -name "*.tsx" -o -name "*.ts" \) | wc -l
find src/pages  -type f \( -name "*.tsx" -o -name "*.ts" \) | wc -l
grep -roE "<[Bb]utton" src/pages src/components | wc -l
grep -roE "useForm\(|<form " src/pages src/components | wc -l
grep -roE "from ['\"]zod['\"]|z\.object\(" src | wc -l
grep -roE "supabase\.channel\(|\.on\('postgres_changes'" src | wc -l
grep -roE "RTCPeerConnection" src | wc -l
```