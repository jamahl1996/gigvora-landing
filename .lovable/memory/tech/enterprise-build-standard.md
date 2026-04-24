---
name: Enterprise Build Standard
description: Production + enterprise + institutional bar that applies to every domain pack and retro-applies to past scaffolds
type: preference
---
**Rule:** No domain ships as a scaffold. "Working stub" is not an acceptable end state.

**Definition of Done (per domain pack):**
1. **Persistence** — real Postgres schema with migrations + seeders. In-memory `Map`-backed repositories are only allowed as a fast unit-test seam behind the same interface a Postgres-backed repo implements; the Postgres path must exist, be wired by env, and be the default in non-test environments. Add unique constraints, FKs, indexes, and check constraints.
2. **RBAC + policy** — every write enforces role/membership; every read enforces visibility. Owners cannot self-demote. Cross-tenant access is impossible by construction (composite keys / tenant_id filters).
3. **Validation** — Zod (or equivalent) at the controller boundary; reject unknown fields; URL/email/UUID/length bounds on every string; arrays bounded.
4. **Audit + observability** — every state change writes an audit row (actor, action, diff, ts) and emits a structured log line. Add request IDs, latency, and outcome to logs.
5. **Idempotency + concurrency** — POSTs that may be retried accept an `Idempotency-Key`; updates use optimistic concurrency (`updatedAt` or `version`).
6. **Pagination + filters + sort** — stable typed envelope `{ items, total, page, pageSize }`. No unbounded list endpoints.
7. **Errors** — consistent envelope `{ error: { code, message, details? } }` with HTTP status. Never leak internals.
8. **Rate-limit + abuse posture** — per-identity rate limits on write endpoints; size limits on bodies and uploads.
9. **GDPR / UK posture** — lawful basis documented, retention policy declared, hard-delete + export hooks present where personal data is stored.
10. **Tests** — Jest for service + repository, Pytest for analytics, Playwright smoke for the primary route, contract test for SDK shape.
11. **Docs** — `docs/architecture/domain-NN-*.md` with surfaces, state machines, RBAC, analytics, mobile parity, SDK, tests, and governance sections.
12. **SDK** — typed client method per endpoint; shared interfaces exported; semver bumped on contract change.
13. **Mobile** — see Mobile Screens Mandate; API client alone is incomplete.

**Retro-hardening:** When any past scaffolded domain is touched, upgrade it to this bar in the same change. Do not extend a scaffold.
