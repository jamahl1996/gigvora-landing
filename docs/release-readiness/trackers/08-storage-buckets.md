# Tracker 08 — Storage Buckets, File Classes, Signed URLs, Retention

## Schema

| Bucket | Public? | File classes | Max size | Allowed MIME | Signed URL TTL | Retention | RLS policy | Status | Phase | Evidence |
|--------|---------|--------------|----------|--------------|----------------|-----------|------------|--------|-------|----------|

## Rows

| Bucket | Public? | File classes | Max size | Allowed MIME | Signed URL TTL | Retention | RLS policy | Status | Phase | Evidence |
|--------|---------|--------------|----------|--------------|----------------|-----------|------------|--------|-------|----------|
| _Phase 01: tracker initialised._ | — | — | — | — | — | — | — | Not started | 01 | BLOCKERS.md#B-002 |
| _Phase 05: storage policy recorded — managed Supabase Storage holds 0 buckets; Gigvora media goes through user-owned S3 reached via api-nest media-pipeline (per `docs/architecture/supabase-removal.md` §Storage)._ | — | — | — | — | — | — | — | Verified | 05 | `audits/05-supabase-foundation.md` §8 |