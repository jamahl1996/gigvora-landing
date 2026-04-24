---
name: One-pass domain completion to enterprise production grade
description: When the user requests a domain build, it must be completed in a single turn end-to-end at full enterprise production grade — never staged, never partial, never deferred to "next turn".
type: preference
---

**Rule:** A domain request ("Domain N — …") is a contract for a single-turn
end-to-end production-grade landing. The previous staged-hardening
discipline (one domain per turn) is **superseded by this rule when the user
issues a domain prompt**. Within one turn, the AI MUST deliver every layer:

1. **NestJS module** — controllers, services, repositories, DTOs, guards,
   audit hooks, idempotency, throttling, error envelopes — under
   `apps/api-nest/src/modules/<domain>/`.
2. **Drizzle schema + Postgres migration SQL** — `packages/db/src/schema/<domain>.ts`
   and `packages/db/migrations/<NNNN>_<domain>.sql`.
3. **Python ML** (when the domain benefits) — `apps/ml-python/app/<domain>.py`
   with deterministic primary path + locked envelope, per
   [ML/Analytics must be enterprise-grade](mem://tech/ml-enterprise-grade-rule).
4. **Python analytics** — `apps/analytics-python/app/<domain>.py`.
5. **Flutter parity** — `apps/mobile-flutter/lib/features/<domain>/` with
   API client, providers, list/detail/edit screens, and route registration
   in `apps/mobile-flutter/lib/app/router.dart`.
6. **SDK namespace** — typed namespace added to `packages/sdk/src/index.ts`.
7. **Frontend wiring** — every existing web page in the domain wired to the
   live `/api/v1/<domain>/*` envelopes via TanStack Query, preserving UI,
   adding loading/empty/error/retry states.
8. **Playwright suite** — `tests/playwright/<domain>.spec.ts`.
9. **Architecture doc** — `docs/architecture/domain-NN-<domain>.md`.
10. **Plan tick + memory index update.**

**Forbidden phrases in the turn summary:**
- "Still open for full Domain N closure"
- "Next turn we will…"
- "Deferred to follow-up"
- "Shallow scaffolding for now"
- "Continuing in the next pass"

If the scope genuinely cannot fit in one turn, the AI must (a) stop
immediately, (b) call `questions--ask_questions` to surface the trade-off
explicitly with concrete numbers (file count, screen count), and (c) let
the user choose **before** writing any code. It must never silently produce
a partial domain.

**Why:** the user explicitly stated they never want a domain split across
turns. Splitting a domain produces broken intermediate states and forces
operators to remember which page is wired and which is still on a mock.
One-pass completion is the only posture that satisfies "enterprise
production grade in full".

**Interaction with [Staged Hardening Discipline](mem://tech/staged-hardening-discipline):**
The staged rule still governs cross-domain sweeps that the user did NOT
prompt as a domain build (e.g. "harden everything"). For an explicit
"Domain N — …" prompt, this one-pass rule wins.
