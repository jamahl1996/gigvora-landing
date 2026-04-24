---
name: Single-sweep domain completion rule (reinforced)
description: Every "Domain N — …" prompt must be shipped fully end-to-end in ONE response. Never defer SDK, frontend wiring, Flutter, Playwright, or doc artifacts to a "next turn".
type: preference
---

**Rule (reinforced, supersedes any prior staging language):**
When the user issues a "Domain N — …" prompt, the AI MUST deliver every layer
in a SINGLE response, no matter how long:

1. NestJS module (controllers, services, repositories, DTOs, guards, audit, idempotency)
2. Drizzle schema + Postgres migration SQL (when persistence is needed)
3. **Python ML service — MANDATORY for every domain.** Add `apps/ml-python/app/<slug>.py` with at least one deterministic explainable endpoint (scoring, prioritisation, anomaly hint, classification) and register it in `apps/ml-python/app/main.py`. NEVER skip ML — if predictive ML truly doesn't fit, ship a deterministic scoring/ranking endpoint instead. Bridge it from the NestJS service with a fallback.
4. Python analytics service `apps/analytics-python/app/<slug>.py` registered in `main.py`
5. **Socket.IO realtime — MANDATORY when the domain has state transitions.** Inject `NotificationsGateway` into the domain service and call `emitToUser/emitToTopic/emitToEntity` on every meaningful create/update/cancel/transition. Document the event names in the domain doc.
6. **Package & 3rd-party integration check — MANDATORY.** In the domain doc, list every npm/pip package, Lovable connector, and external provider the domain reuses (calendar, video, payments, storage, email, SMS, AI/BYOK, CRM, webhooks). If a new dependency is needed, install it via `code--add_dependency`. If a connector is the right home, name it. Never ship a "third-party adapter" stub without naming concrete providers.
7. SDK namespace appended to `packages/sdk/src/index.ts` (typed methods)
8. **Frontend wiring of EVERY listed page**: replace ALL mocks (MOCK_*, hardcoded arrays) with `useQuery`/`useMutation` against the SDK, with explicit loading/empty/error/disputed states via `<DataState>`
9. Flutter feature pack (api client + list/detail/edit screens) using `AsyncStateView` + `OfflineCache`
10. Playwright spec covering primary surfaces + key flows
11. Architecture doc `docs/architecture/domain-NN-<slug>.md`
12. Back-fill matrix tick + memory index update

**Forbidden phrases in the turn summary:**
- "Next turn we will…"
- "Still to ship for full Domain N closure"
- "Frontend wiring pending"
- "Playwright pending real seed IDs"
- "Continuing in the next pass"
- "Deferred to follow-up"

If genuine scope requires splitting, the AI MUST stop, call
`questions--ask_questions` with concrete file/screen counts BEFORE writing any
code, and let the user choose. Never silently produce a partial domain.

**Why:** Partial domain shipments leave broken intermediate states (backend
exists but UI still mocks, or SDK exists but Flutter doesn't) and force the
user to remember which page is wired. Single-sweep completion is the only
posture that satisfies "enterprise production grade in full".
