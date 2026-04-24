---
name: Frontend integrations must be fully complete per domain
description: Every page in a domain must be wired to live envelopes with full loading/empty/error/retry states, every button must have a working handler, and every logic flow must be exercised by Playwright. No half-wired pages, no dead buttons.
type: preference
---

**Rule:** "Frontend wiring" for a domain is not done until **every page in
the domain** meets all of these:

1. **Live envelope wiring** via TanStack Query hook from `src/hooks/use<Domain>.ts`,
   with a UI-preserving fixture fallback when `VITE_GIGVORA_API_URL` is unset.
2. **All four journey states** rendered: loading skeleton, empty state with
   CTA, error state with retry, and populated state.
3. **Every button has a real handler** — no `onClick={() => {}}`, no `href="#"`,
   no "TODO" comments. Mutations call the right hook, navigations use the
   typed router, and disabled states reflect entitlement + auth.
4. **Logic flow completeness** — multi-step flows (RSVP → check-in → replay,
   apply → screen → offer, draft → publish → archive) have every transition
   wired, including cancel/back paths and confirmation dialogs.
5. **Playwright coverage** in `tests/playwright/<domain>.spec.ts` exercising
   the primary happy path plus at least one error path.

**Back-fill obligation:** When this rule is added, every previously-shipped
domain must be revisited. Any page with mock-only data, dead buttons, or
missing journey states must be brought to this bar, then ticked off in
`docs/architecture/domain-NN-<domain>.md`.

**Forbidden in any committed page:**
- `onClick={() => {}}` or `onClick={() => console.log(...)}`
- `<a href="#">` or `<Button>` with no handler
- Hard-coded fixture arrays inside the component (must come from a hook)
- Missing error or empty states
- "Coming soon" placeholders on a page that has a route

**Why:** Half-wired pages create the illusion of completeness and force
operators to discover dead ends in production. Full wiring is the only
posture that satisfies "enterprise production grade".
