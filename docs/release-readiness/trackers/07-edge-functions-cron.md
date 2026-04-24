# Tracker 07 — Edge Functions, Cron Jobs, Automations

## Schema

| Function | Path / route | Trigger | Auth model | Inputs (Zod) | Outputs | Status | Phase | Evidence |
|----------|--------------|---------|------------|--------------|---------|--------|-------|----------|

## Rows

| Function | Path / route | Trigger | Auth model | Inputs (Zod) | Outputs | Status | Phase | Evidence |
|----------|--------------|---------|------------|--------------|---------|--------|-------|----------|
| _Phase 01: tracker initialised. Inventory begins Phase 02._ | — | — | — | — | — | Not started | 01 | BLOCKERS.md#B-009 |
| _Phase 05: edge-fn governance recorded — every fn must be listed here with purpose, secrets, schedule (if any), and `verify_jwt` setting._ | — | — | — | — | — | Verified | 05 | `audits/05-supabase-foundation.md` §7 |
| ai-assistant | `supabase/functions/ai-assistant/index.ts` | HTTP (browser invoke) | `verify_jwt = true` (default) | unvalidated today (Zod TBD) | streamed completion via Lovable AI Gateway | In progress | 05 | uses `LOVABLE_API_KEY` secret; rotate via `ai_gateway--rotate_lovable_api_key` |