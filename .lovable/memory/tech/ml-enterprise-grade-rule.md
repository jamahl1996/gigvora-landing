---
name: ML/Analytics must be enterprise-grade
description: All ML and analytics services must be enterprise-grade in full — never mocked, never half-stubbed — and must remain runnable on a 16 GB-RAM VPS without a GPU.
type: constraint
---

All ML and analytics endpoints (apps/ml-python, apps/analytics-python, and any
NestJS adapters that surface their outputs) must satisfy ALL of the following:

1. **No mocks, no half-stubs.** Every endpoint returns a real, defensible
   computation. A trivial echo or `{ ok: true }` response is forbidden.
2. **Deterministic primary path.** Each ranker / scorer / insight endpoint must
   ship a deterministic implementation (TF-IDF overlap, signal-weighted scoring,
   HN-style decay, component-weighted health bands). Heavier learned variants
   are an opt-in second path, not a replacement.
3. **16 GB-RAM VPS runnable.** No GPU dependency. No model weights >500 MB at
   default config. Sentence-transformers MiniLM-class models are acceptable
   when explicitly mounted; defaults must run without them.
4. **Locked envelope.** Response shape is part of the contract — heavier
   backends must substitute behind the same envelope so callers never change.
5. **Graceful fallback.** If a heavier backend is unavailable, the deterministic
   path returns the same envelope shape with `model: "*-deterministic"`.
6. **Defensible by an operator.** Every score must include component breakdown
   or a `reason` object so a Trust & Safety / ops reviewer can explain it.

**Why:** the user explicitly required enterprise-grade ML in full, runnable on
a 16 GB-RAM VPS, with no scaffolds or mocks. Violating any of the six rules
above is a hardening regression and must be fixed before the domain is ticked.
