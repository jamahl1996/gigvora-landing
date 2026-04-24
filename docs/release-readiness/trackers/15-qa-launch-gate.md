# Tracker 15 — Final QA, Playwright, Browser, Mobile, Launch Gate

## Schema

| Suite | Spec file | Routes covered | Last run | Pass/fail | Phase | Evidence |
|-------|-----------|----------------|----------|-----------|-------|----------|

## Existing specs (Phase 01 inventory)

| Suite | Spec file | Routes covered | Last run | Pass/fail | Phase | Evidence |
|-------|-----------|----------------|----------|-----------|-------|----------|
| Enterprise route matrix | `tests/playwright/enterprise-matrix.spec.ts` | 10 (feed, network, profile, companies, agency, groups, events, notifications, search, settings) | not run by this programme | unknown | 01 | — |

## Launch gate

The launch gate is reached when:

- [ ] All trackers 01–14 have zero `Not started` rows.
- [ ] `BLOCKERS.md` has zero `Open` rows of severity Critical or High.
- [ ] Tracker 15 has at least one passing Playwright run per major
      domain (feed, network, profile, companies, marketplace, hire,
      messaging, payments, admin).
- [ ] Final security scan returns no Critical or High findings.