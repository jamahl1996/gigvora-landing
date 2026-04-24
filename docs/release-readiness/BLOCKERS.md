# Unresolved Blockers Register

Every deferred item, known gap, or programme-level risk lives here. Phases
may resolve blockers (mark `Resolved` + link the phase) but MUST NOT delete
rows.

| ID    | Opened     | Phase | Severity | Area        | Description                                                             | Status   | Resolved by |
|-------|------------|-------|----------|-------------|-------------------------------------------------------------------------|----------|-------------|
| B-001 | 2026-04-23 | 01    | Critical | Supabase    | Zero `public.*` tables exist — no product data persistence anywhere.    | Open     | —           |
| B-002 | 2026-04-23 | 01    | Critical | Supabase    | Zero storage buckets — uploads have no destination.                     | Open     | —           |
| B-003 | 2026-04-23 | 01    | Critical | Realtime    | Zero `supabase.channel(...)` subscriptions in `src/`.                   | Open     | —           |
| B-004 | 2026-04-23 | 01    | Critical | WebRTC      | Zero `RTCPeerConnection` constructions — calls/rooms unimplemented.     | Open     | —           |
| B-005 | 2026-04-23 | 01    | Critical | Validation  | Zero Zod schemas in repo despite ~614 page files.                       | Open     | —           |
| B-006 | 2026-04-23 | 01    | High     | UX          | ~4,670 `<Button>` usages, audit estimates ~2,082 with no real handler.  | Open     | —           |
| B-007 | 2026-04-23 | 01    | High     | Forms       | Only ~12 real form/`useForm` surfaces across ~614 page files.           | Open     | —           |
| B-008 | 2026-04-23 | 01    | High     | Architecture| App still under `src/pages/*` (legacy SPA), not `src/routes/*` (TSR).   | Open     | —           |
| B-009 | 2026-04-23 | 01    | Medium   | Edge fns    | Edge function inventory unverified — programme assumes ~1 deployed.     | Open     | —           |
| B-010 | 2026-04-23 | 01    | Medium   | Admin       | No documented admin role enforcement at server side (RLS or fn).        | Open     | —           |
| B-011 | 2026-04-23 | 02    | High     | Routing     | Path collision `/services/orders` — A:`ServiceOrdersPage` vs B:`ServiceOrdersCenterPage`. Resolution: keep B, delete A. | Open     | —           |
| B-012 | 2026-04-23 | 02    | High     | Routing     | Path collision `/services/analytics` — A:`ServicesMarketplacePage` vs B:`ServiceAnalyticsPage`. Resolution: keep B, delete A. | Open     | —           |
| B-013 | 2026-04-23 | 02    | High     | Routing     | Admin path collision `finance` — A:`FinanceAdminPage` vs B:`FinanceLandingPage`. Resolution: keep B, move A under `/internal/admin/ops/finance`. | Open     | —           |
| B-014 | 2026-04-23 | 02    | High     | Routing     | Admin path collision `moderation` — A:`AdminOpsPage` vs B:`ModerationLandingPage`. Resolution: keep B, move A under `/internal/admin/ops/moderation`. | Open     | —           |
| B-015 | 2026-04-23 | 02    | Medium   | Routing     | 7 alias paths still serve content directly instead of 301-redirecting to canonical (see audit §4: `/sales-navigator`, `/recruiter`, `/admins`, `/agencies/:slug`, `/signin`, `/signup`, `/services/mine`). | Open     | —           |
| B-016 | 2026-04-23 | 02    | Medium   | Routing     | 24 splat (`/*`) routes serve a generic shell index instead of a per-domain `notFoundComponent`. Replace during TanStack Start migration (B-008). | Open     | —           |
| B-017 | 2026-04-23 | 03    | High     | Navigation  | `NavigationRail` (N-09) advertises 7 `/admin/*` paths to all authed users — none are mounted (atlas has only 2 admin paths). Removes admin block; admin reachable only via N-18 admin-shell. | Open     | —           |
| B-018 | 2026-04-23 | 03    | High     | Navigation  | `AdminShell` (N-18) `ADMIN_NAV` uses 15 `/admin/*` paths; canonical is `/internal/*` (atlas has 17 internal routes, only 2 admin). Rewrite ADMIN_NAV + add 301 from `/admin/*`. Pairs with B-013/B-014. | Open     | —           |
| B-019 | 2026-04-23 | 03    | Medium   | Navigation  | Avatar dropdown comment says admin link removed entirely; per `mem://tech/admin-isolation` it MAY surface a "Switch to Admin" entry guarded by `auth.hasRole('admin')`. | Open     | —           |
| B-020 | 2026-04-23 | 03    | Medium   | Navigation  | Public mega menu Solutions block uses `/solutions/<x>` paths that are not mounted; rebrand hrefs to `/showcase/<x>` (per `mem://features/public-showcase-pages`). | Open     | —           |
| B-021 | 2026-04-23 | 03    | Medium   | Navigation  | `Footer` (N-19) exposes only 4 routes; missing `/status`, `/help`, `/pricing`, `/about`, `/careers`, `/contact`, `/blog`, `/legal/cookies`, `/legal/dpa`, `/legal/aup`, `/sitemap`. | Open     | —           |
| B-022 | 2026-04-23 | 03    | Medium   | Navigation  | `MobileBottomNav` (N-10) has no Dashboard slot — users on `/feed` cannot bridge to dashboard with one tap. Replace `/jobs` slot with `/dashboard` for User/Pro; add `/networking` for Enterprise. | Open     | —           |
| B-023 | 2026-04-23 | 03    | High     | Security    | `QuickCreateMenu` (N-06) advertises 3 `/admin/*` paths to all authed users (privilege-leak vector). Gate behind `auth.hasRole('admin')` or remove. | Open     | —           |
| B-024 | 2026-04-23 | 03    | Medium   | Navigation  | `DashboardSidebar` (N-08) exposes 31 `/dashboard/*` paths; 5 not yet cross-checked against atlas (36 mounted). Verify during Phase 06. | Open     | —           |
| B-025 | 2026-04-23 | 03    | High     | Security    | Avatar dropdown's role switcher (`setActiveRole`) has no server-side enforcement — any client can switch to Enterprise UI without holding the role. Must gate against `user_roles` table membership in Phase 18. | Open     | —           |
| B-026 | 2026-04-23 | 03    | Medium   | Data hygiene| Logged-in mega menu hard-codes `/inbox/sarah` demo link in production nav. Replace with `/inbox` only or drive from query. | Open     | —           |
| B-027 | 2026-04-23 | 03    | Low      | Navigation  | Avatar dropdown shows two "Dashboard" rows (generic `/dashboard` from COMMON_ITEMS + role-specific from ROLE_MENU_ITEMS). Drop the generic when a role-specific exists. | Open     | —           |
| B-028 | 2026-04-23 | 03    | Medium   | Navigation  | 7 admin-only routes (`/internal-chat`, `/customer-chat`, `/kpi-cards`, `/notices`, `/website-settings`, `/trust`, plus follow-ups) have no nav home; admin-shell (N-18) must absorb them in Phase 18. | Open     | —           |
| B-029 | 2026-04-23 | 04    | Low      | Navigation  | A small set of sub-shell home routes render both `AutoBackNav` (shell) and `SectionBackNav` (page). Cosmetic only — no broken nav. Suppress `AutoBackNav` per sub-shell when it owns its breadcrumb. | Open     | —           |
| B-030 | 2026-04-23 | 04    | Medium   | Navigation  | Empty-state placeholders across `src/pages/` still ship raw "No items / No results" strings without a recovery CTA. Each domain phase must migrate its empty states to `EmptyStateCTA` so no page is a dead end. | Open     | —           |
| B-031 | 2026-04-23 | 05    | Medium   | Env / config| Feature code may still read `import.meta.env.VITE_SUPABASE_*` directly instead of going through the new `src/lib/env.ts` facade. Each domain phase must sweep its files and replace direct reads with `clientEnv` / `loadServerEnv()`. | Open     | —           |
| B-032 | 2026-04-23 | 05    | High     | Security    | No automated lint guard yet prevents `SUPABASE_SERVICE_ROLE_KEY` (or any `process.env.*` read) from appearing under `src/components/**`, `src/pages/**`, `src/hooks/**`, `src/routes/**`. Phase 14 (security) must add a CI sweep / ESLint rule. | Open     | —           |
| B-033 | 2026-04-23 | 05    | Medium   | Auth        | Auth provider plan recorded (email+password, Google, no anon, no auto-confirm, HIBP on) but not yet implemented via `supabase--configure_auth`. Belongs to the dedicated auth phase. | Open     | —           |
| B-034 | 2026-04-23 | 05    | Low      | Migrations  | The agent has no automated check that prevents an enterprise domain table from being created via `supabase--migration` (which would violate `mem://tech/no-domain-code-in-supabase`). Mitigated by memory + audit doc; needs a CI assertion against `supabase/migrations/` filenames. | Open     | —           |
| B-035 | 2026-04-23 | 06    | Medium   | Admin / nav | `QuickCreateMenu` (N-06) still surfaces admin-only paths to standard users. Underlying gates are now server-enforced (Phase 06), so a click leads to a redirect, but the UI should hide entries the user cannot use. Sweep menu items by `useUserRoles().isAdmin`. | Open     | —           |
| B-036 | 2026-04-23 | 06    | Low      | Admin / UX  | There is no UI for super-admins to grant or revoke roles. The role table + RLS exist; for now grants happen via SQL. Build a `/admin/access` surface in a later admin phase that calls `user_roles` insert/delete. | Open     | —           |

## Resolution protocol

1. When a phase resolves a blocker, change `Status` to `Resolved` and put
   the phase number in `Resolved by`.
2. Add a one-line note in `PHASE_LOG.md` under that phase referencing the
   blocker ID.
3. Never reuse IDs. New blockers always get the next free `B-NNN`.

## Backfill — 2026-04-23 (Phases 02 + 03 build gaps)

Resolved with real code edits (typecheck clean). See
`audits/backfill-p02-p03.md` for the per-file change table.

- **B-011** Resolved — duplicate `/services/orders` route deleted; `ServiceOrdersCenterPage` now wins.
- **B-012** Resolved — duplicate `/services/analytics` route deleted; `ServiceAnalyticsPage` now wins.
- **B-015** Resolved — `/signin`, `/signup`, `/services/mine`, `/sales-navigator` now `<Navigate replace>` to canonical; `/auth/sign-in` and `/auth/sign-up` mounted. (`/recruiter`, `/admins` were ghosts — never mounted.)
- **B-019** Resolved — AvatarDropdown surfaces "Switch to Admin Console" gated by `useUserRoles().isAdmin`.
- **B-020** Resolved — 8 `/solutions/*` hrefs rewritten to `/showcase/*` in `PUBLIC_MEGA_MENUS` and `FOOTER_COLUMNS`.
- **B-021** Resolved — footer Legal column expanded with `/legal/cookies`, `/legal/dpa`, `/legal/aup`.
- **B-022** Resolved — `MobileBottomNav` `/jobs` slot replaced with `/dashboard`.
- **B-023, B-035** Resolved — `QuickCreateMenu` falls back to `user` actions when active role is `admin` but server says not admin.
- **B-026** Resolved — `/inbox/sarah` demo deep-link removed.
- **B-027** Resolved — duplicate Dashboard removed from AvatarDropdown `COMMON_ITEMS`.

## Phase 7.1 — new blockers

| ID    | Opened     | Phase | Severity | Area      | Description | Status | Resolved by |
|-------|------------|-------|----------|-----------|-------------|--------|-------------|
| B-037 | 2026-04-23 | 7.1   | High     | Data wiring | Front-end has **zero** `supabase.from()` calls — every page is mock data. Identity tables (profiles/orgs/settings/professional_profiles) now exist with RLS but no UI reads or writes them. Wiring deferred to per-domain phases (Phase 8 forms, then domain-specific data hooks). | Open | — |

## Phase 8 — new blockers

| ID    | Opened     | Phase | Severity | Area      | Description | Status | Resolved by |
|-------|------------|-------|----------|-----------|-------------|--------|-------------|
| B-038 | 2026-04-23 | 8.1   | High     | UI wiring | Identity data hooks (`useMyProfile`, `useUpdateMyProfile`, `useMyUserSettings`, `useUpdateMyUserSettings`, `useMyProfessionalProfile`, `useUpsertMyProfessionalProfile`, `useProfile`, `useProfessionalsForHire`) ship in `src/lib/data/*` but no page yet imports them. Sweep `src/pages/profile/**`, `src/pages/settings/**`, `src/pages/dashboard/**` to replace mock data. Owned by Phase 8.2. | Open | — |
| B-039 | 2026-04-23 | 8.1   | Medium   | Forms     | Mutations are typed (Zod-validated) but no `<form>` + `zodResolver(profileUpdateSchema)` is wired to a real page yet. Phase 8.2 hooks the schemas into `ProfileEditPage` and `SettingsPage` first as the canonical pattern. | Open | — |
| B-040 | 2026-04-23 | 8.1   | Low      | Realtime  | `posts` and `messages` are joined to `supabase_realtime` (P7.5) but no client `supabase.channel(...)` subscription exists yet. Phase 8.5 (Social) wires the first realtime listener. | Open | — |
## Phase 7 wave 1 — new blockers

| ID    | Opened     | Phase | Severity | Area    | Description | Status | Resolved by |
|-------|------------|-------|----------|---------|-------------|--------|-------------|
| B-042 | 2026-04-23 | 7-w1  | Medium   | Consent UI | `useRecordLegalAcceptance()` hook ships but no signup screen, account/legal page, or cookie-banner calls it. Until a UI surface invokes it, no rows land in `legal_acceptances`. Owner: Phase 8 (auth/consent UI sweep). | Open | — |

| B-043 | 2026-04-23 | 8-w2 | Medium | UI wiring | Feed/messages/notifications hooks ship; UI surfaces still call mock data. Owner: Phase 9 UI sweep. | Open | — |
| B-044 | 2026-04-23 | 8-w2 | Medium | Notification fan-out | RLS limits client inserts to self-notifications. Cross-user notifications (e.g. "X commented on your post") need server-fn or DB-trigger writers via service role. Owner: Phase 9 server fns. | Open | — |

## Phase 9.1 / 9.2 — new blockers and resolutions

| ID    | Opened     | Phase | Severity | Area      | Description | Status | Resolved by |
|-------|------------|-------|----------|-----------|-------------|--------|-------------|
| B-044 | 2026-04-23 | 8-w2 | Medium | Notification fan-out | RLS limits client inserts to self-notifications. | **Resolved** | Phase 9.1 — `public.send_notification(...)` SECURITY DEFINER RPC + `src/lib/data/sendNotification.ts` wrapper. Caller must be `auth.uid()`; refuses self-spam. |
| B-045 | 2026-04-23 | 9.2  | Medium | UI wiring | Mock-data shapes (string budgets like "$8,000", date strings like "Apr 28") diverge from DB columns (cents integers, ISO timestamps). Live panels coexist with legacy mock rails until Phase 9.3 swaps them out via shape adapters. | Open | Phase 9.3 |
| B-046 | 2026-04-23 | 9.2  | Low    | UI wiring | Legacy `CONTRACTS` / `GROUPS` / `PROPOSALS` constants still rendered below the live panels on Proposals/Contracts/Groups pages. Removed in Phase 9.3 once shape adapters land. | Open | Phase 9.3 |
| B-047 | 2026-04-23 | 9.2  | Low    | Enterprise security | App still uses `react-router-dom` (browser-only) — no TanStack Start server functions yet, so all DB I/O goes via the publishable Supabase client + RLS. `client.server.ts` admin client + `auth-middleware.ts` placeholders are ready for the future migration. | Open | Future router migration |
| B-048 | 2026-04-23 | 9.2  | Medium | UI wiring | 25 of 28 domains still on mock data: feed, jobs, gigs, services, projects, messaging, notifications, hire, work, networking sub-pages, mentorship, webinars, calls, webhooks, events, podcasts, business cards, deliverables, milestones, payments, payouts, disputes, reviews, audit, admin. Owner: Phases 9.3+, three domains per turn. | Open | — |
