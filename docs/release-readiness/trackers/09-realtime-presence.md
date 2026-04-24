# Tracker 09 — Realtime, Presence, Notifications, Live Streams

## Schema

| Channel | Surface (page) | Source table / broadcast | Event(s) | Subscriber hook | Status | Phase | Evidence |
|---------|----------------|--------------------------|----------|-----------------|--------|-------|----------|

## Baseline (Phase 01)

- `supabase.channel(...)` subscriptions: **0** (B-003).

## Rows

| Channel | Surface | Source | Event(s) | Hook | Status | Phase | Evidence |
|---------|---------|--------|----------|------|--------|-------|----------|
| _Phase 01: tracker initialised._ | — | — | — | — | Not started | 01 | BLOCKERS.md#B-003 |
| _Phase 05: realtime policy recorded — managed Supabase Realtime not used for Gigvora domains; new realtime work goes through Socket.IO in api-nest (per `docs/architecture/supabase-removal.md` §Realtime). Any Supabase channel added MUST be flagged for migration in the same PR._ | — | — | — | — | Verified | 05 | `audits/05-supabase-foundation.md` §9 |