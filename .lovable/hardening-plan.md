# Enterprise hardening + mobile screens — execution plan

Companion to `.lovable/plan.md` (the long-form master plan, untouched).
This file tracks the multi-turn plan agreed with the user to retro-harden
every prior scaffold to production + enterprise + institutional grade and to
ship the Flutter screens that were previously omitted.

## Foundation — landed (this turn)

- `packages/db` — shared Drizzle ORM + node-postgres workspace package, with
  schemas for `audit_events`, `idempotency_keys`, feed, network, profiles,
  companies. Single source of truth for DB structure going forward.
- `database/migrations/0015_foundation.sql` — bootstrap SQL for audit and
  idempotency tables (per-domain DDL is owned by Drizzle; future migrations
  generated via `drizzle-kit generate`).
- `apps/api-nest/src/infra/` — global `InfraModule` providing:
  - `DB` token wrapping the Drizzle handle.
  - `AuditService.write(...)` — append-only audit log + structured log line.
  - `IdempotencyService.run(...)` — replay-safe POST handlers.
  - `ErrorEnvelopeFilter` — consistent `{ error: { code, message, details? } }`.
  - `ZodPipe` — controller-boundary validation that integrates with the filter.
- `apps/mobile-flutter/lib/core/async_state.dart` — shared `AsyncStateView`,
  `confirmAction`, `showSnack`. Every domain screen built going forward uses
  these to satisfy the loading/empty/error/success/stale state requirement of
  the Mobile Screens Mandate.

## Activation step (one-time, owner runs)

The new `@gigvora/db` package needs to be added to the root workspace
`package.json` and then `pnpm install` (or `bun install`) run. After that,
`apps/api-nest` should declare `"@gigvora/db": "workspace:*"` in its deps and
`InfraModule` should be added to `app.module.ts` imports. I'll wire those in
the Domain 09 turn so they ship together with the first hardened consumer
and there is no orphan dependency on `main` between turns.

## Top-4 hardened domains — landing in the next turns (one per turn)

For each, the deliverable is:

1. **Backend** — replace the in-memory repository with a Drizzle-backed one
   wired through `DB`, keep the existing service contract, add `AuditService`
   on every state change, wrap POST handlers in `IdempotencyService`, validate
   every body with `ZodPipe`, add `@Throttle()` on writes, ensure pagination
   envelopes are typed and bounded.
2. **Tests** — Jest service spec runs against an in-memory shim of the
   repository interface (no Postgres required) plus a thin Drizzle integration
   spec gated on `DATABASE_URL`.
3. **Mobile screens** — at minimum: list (with search/filter), detail, compose
   / edit, and any domain-specific action sheets. Routed in
   `apps/mobile-flutter/lib/app/router.dart` with deep links matching the web
   URL family. Every screen uses `AsyncStateView`.
4. **Doc** — update `docs/architecture/domain-NN-*.md` with a "Mobile screens"
   section listing every file delivered, plus an "Enterprise posture" section
   confirming Postgres / RBAC / audit / idempotency / rate-limit / error
   envelope are wired.

Order:
- ✅ Domain 09 — Feed (landed)
- ✅ Domain 10 — Network (landed)
- ✅ Domain 11 — Profiles (landed)
- ✅ Domain 12 — Companies (landed)
- ✅ Domain 02 — Marketing (landed)
- ✅ Domain 03 — Identity (landed)
- ✅ Domain 04 — Entitlements (landed)
- ✅ Domain 05 — Search (landed)
- ✅ Domain 06 — Overlays (landed)
- ✅ Domain 07 — Notifications (landed)
- ✅ Domain 08 — Settings (landed)
- ✅ Domain 09 — Profiles envelopes (landed; full screens already shipped)
- ✅ Domain 02 — Marketing envelopes (landed; full screens already shipped)
- All domains landed — sweep complete.

## Remaining domains (02–08) — follow-up turns

After the top-4 are landed, the same hardening pass and full mobile screen
build is applied to:

- 02 Marketing
- 03 Identity
- 04 Entitlements
- 05 Search
- 06 Overlays
- 07 Notifications
- 08 Settings

Each turn closes one domain to the same Definition of Done.

## Why staged, not one mega-turn

A single tool turn cannot safely produce the ~300+ files this entails without
truncating output. Staging guarantees every turn green-builds and every domain
ends in a verifiably complete state, which is what the "no scaffolds" rule
actually requires. The user explicitly chose "Foundation + top-4 this turn,
rest in follow-ups" after being shown the trade-off.
