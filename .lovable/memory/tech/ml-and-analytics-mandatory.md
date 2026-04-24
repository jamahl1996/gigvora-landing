---
name: ML and Python analytics are mandatory, never optional
description: Every domain that lists ML or Python analytics as "optional" must in fact ship them at full enterprise grade — deterministic primary path, locked envelope, runnable on a 16 GB-RAM VPS without GPU. No skipping, no stubs.
type: preference
---

**Rule:** When a domain spec says "ML optional" or "analytics optional", treat
that as **MANDATORY at enterprise production grade**. The optional flag in the
spec only governs whether the *user-facing surface* exposes it — the backing
service must always exist, be deterministic, and be production-grade.

**What "enterprise grade" means here:**
1. **ML service** under `apps/ml-python/app/<domain>.py`:
   - Deterministic primary algorithm (rules, embeddings, scoring, ranking) —
     never a thin wrapper around a hosted LLM call as the only path.
   - Locked response envelope `{ data, meta: { model, version, latency_ms } }`.
   - Runnable on a 16 GB-RAM VPS without a GPU (CPU-only, no CUDA deps).
   - Unit tests in `apps/ml-python/tests/test_<domain>.py`.
2. **Analytics service** under `apps/analytics-python/app/<domain>.py`:
   - SQL/Polars/Pandas aggregations against the production schema.
   - Time-bucketed metrics (hour/day/week) with explicit timezone handling.
   - Locked envelope `{ data, meta: { window, computed_at } }`.
   - Unit tests in `apps/analytics-python/tests/test_<domain>.py`.
3. **NestJS bridge** in `apps/api-nest/src/modules/<domain>/<domain>.ml.service.ts`
   and `<domain>.analytics.service.ts` calling the Python services with
   timeouts, retries, and graceful degradation to a deterministic fallback.

**Back-fill obligation:** When this rule is added, every previously-shipped
domain whose spec marked ML/analytics as optional must be revisited and
upgraded to this bar, then ticked off in the architecture doc.

**Why:** "Optional" was being interpreted as "skip", which left the platform
without the deterministic intelligence layer the enterprise tier requires.
This rule eliminates that loophole.
