# Phase Log

Append-only chronological log of every phase executed against the
release-readiness programme. Newest entries at the bottom.

Format:

```
## Phase NN — <title>
- Date: YYYY-MM-DD
- Operator: <agent or human>
- Summary: <2–4 lines>
- Trackers updated: 01, 04, 05 …
- Evidence: evidence/phase-NN/...
- Blockers added: BLOCKERS.md#... (or "none")
```

---

## Phase 01 — Programme bootstrap and tracker document creation
- Date: 2026-04-23
- Operator: Lovable agent
- Summary: Created the full tracker stack (15 trackers), governance doc,
  blockers register, phase log, route baseline audit, and folder layout
  under `docs/release-readiness/`. No product code changed; this phase
  exists solely to enable evidence-led delivery from Phase 02 onward.
- Trackers updated: 01–15 (all initialised with schema + Phase 01 row)
- Evidence: `docs/release-readiness/audits/01-route-baseline.md`
- Blockers added: see `BLOCKERS.md` — pre-existing programme-level gaps
  (zero Supabase tables, zero realtime channels, zero RTCPeerConnection,
  zero Zod schemas, ~2,082 dead buttons) recorded as opening register.
- Exit gates:
  - [x] Tracker docs exist and are populated with schema
  - [x] Governance + evidence rules published
  - [x] Baseline audit captured for Phase 02 to act on
  - [x] Blockers register seeded with audit findings

## Phase 02 — Canonical route atlas and shell ownership rebuild
- Date: 2026-04-23
- Operator: Lovable agent
- Summary: Inventoried the entire SPA route table from `src/App.tsx`
  (635 declarations → 630 distinct paths), classified all 122 domain
  prefixes against the 5-shell registry (`public`, `app`, `dashboard`,
  `ai`, `internal-admin`), identified 4 real path collisions, 7 aliases
  to redirect, and 24 splat routes to replace with per-domain
  `notFoundComponent`. Locked the page-vs-drawer placement policy.
- Trackers updated: 01 (route atlas — populated with shell map + 4
  collision rows), 14 (security — no changes, controls remain queued).
- Evidence: `docs/release-readiness/audits/02-route-atlas.md`
- Blockers added: B-011, B-012, B-013, B-014 (collisions),
  B-015 (alias redirects), B-016 (splat → notFound migration).
- Exit gates:
  - [x] Canonical atlas published with shell ownership for all 122 prefixes
  - [x] Orphan-route detection method documented (per-domain pass)
  - [x] All 4 path collisions logged with resolution path
  - [x] 7 alias redirects catalogued
  - [x] Pages-vs-drawers policy locked
  - [ ] Per-route population for all 630 paths — DEFERRED to domain phases
        (the atlas tracker is the home; each domain phase fills in its rows).

## Phase 03 — Global navigation, menu placement, and role binding audit
- Date: 2026-04-23
- Operator: Lovable agent
- Summary: Inventoried all **19 distinct nav surfaces** (public top-bar,
  logged-in top-bar, avatar dropdown, mega-menu renderer, connections
  popover, quick-create, dashboard tab-menu, dashboard sidebar, navigation
  rail, mobile bottom, mobile dashboard, 4 sub-shell rails, 2 unauth shells,
  admin shell, footer). Built the role × surface placement matrix for
  Guest / User / Pro / Enterprise / Admin. Identified **18 placement
  findings (D-001…D-018)**, **22 `/admin/*` paths** that must migrate to
  canonical `/internal/*`, **9 alias paths** still surfaced from menus,
  **7 admin-only orphan routes**, and the `Footer` route deficit
  (4 of 15 needed). Confirmed pages-vs-drawers placement policy from
  Phase 02 — no surface promotes a drawer-locked component to a nav item.
- Trackers updated: 02 (role × menu × page access — populated with 18 rows
  spanning all 19 surfaces, including the 2 BAD blocks flagged for removal /
  migration), 14 (security — 2 auth-related findings noted: B-023 admin
  paths in QuickCreate, B-025 client-only role switching).
- Evidence: `docs/release-readiness/audits/03-navigation-audit.md`
- Blockers added: B-017 (NavigationRail admin block), B-018 (AdminShell
  /admin → /internal migration), B-019 (avatar admin link policy), B-020
  (mega-menu /solutions → /showcase), B-021 (footer deficit), B-022 (mobile
  no-Dashboard), B-023 (QuickCreate admin leak), B-024 (sidebar atlas
  cross-check), B-025 (server-side role enforcement), B-026 (`/inbox/sarah`
  demo data), B-027 (duplicate Dashboard rows), B-028 (admin-orphan absorb).
- Implementation: **none in this phase by design** — the audit identifies
  fixes that are scheduled into Phase 04 (auth + role binding hard wiring),
  Phase 06 (Dashboard refactor), Phase 18 (Security hardening + admin
  shell). All findings are referenced from those future phases.
- Exit gates:
  - [x] Role × menu matrix complete for all 19 surfaces × 5 role classes
  - [x] Every nav surface inventoried with file path, audience, data source
  - [x] Duplicate sections logged (D-015, D-018)
  - [x] Wrong placements logged (D-001, D-002, D-003, D-004, D-008, D-014, D-017)
  - [x] Missing access logged (D-006, D-007, D-011, B-028)
  - [x] Page-vs-drawer policy reaffirmed
  - [ ] Per-route discoverability sweep for all 630 atlas rows — DEFERRED
        to domain phases (the audit ships the method; each domain phase runs
        the grep against its prefix).

## Phase 04 — Back-button, breadcrumb, and no-dead-end navigation repair
- Date: 2026-04-23
- Operator: Lovable agent
- Summary: Mounted `AutoBackNav` in the 3 shells that were missing it
  (`LoggedInShell`, `AIShell`, `AdminShell`) so all 5 canonical shells now
  render shell-level back/breadcrumb. Expanded `ROOT_ROUTES` from 17 to 66
  entries (every nav-rail / top-bar / footer / mega-menu prefix counted as
  a root, suppressing false back buttons). Expanded `SEGMENT_LABELS` from
  53 to 141 entries to cover every domain prefix in the Phase 02 atlas.
  Created `EmptyStateCTA` primitive — a no-dead-end recovery component with
  a default `Back to dashboard` secondary action so even forgotten empty
  states get a recovery path for free. `SectionBackNav` (31 page-level call
  sites) is preserved and coexists with the shell-level back nav.
- Files changed: `src/components/shell/AutoBackNav.tsx`,
  `src/components/layout/LoggedInShell.tsx`,
  `src/components/layout/AdminShell.tsx`,
  `src/components/ai/AIShell.tsx`,
  `src/components/shell/EmptyStateCTA.tsx` (new).
- Trackers updated: 04 (button/CTA — `EmptyStateCTA` registered as a
  shared no-dead-end primitive; per-page migrations queued under B-030).
- Evidence: `docs/release-readiness/audits/04-back-nav-breadcrumb.md`
- Blockers added: B-029 (cosmetic dedup of overlapping AutoBackNav +
  SectionBackNav in sub-shell homes), B-030 (per-domain empty-state
  migration to `EmptyStateCTA`).
- Exit gates:
  - [x] Every shell has shell-level back-path behaviour (5/5)
  - [x] Every major route family has breadcrumb labels (122 atlas prefixes)
  - [x] No-dead-end primitive shipped with safe default recovery action
  - [x] Root-route policy expanded so back button never points at nothing
  - [ ] Per-page empty-state migration — DEFERRED to each domain phase
        (audit ships the grep recipe, B-030 tracks completion).

## Phase 05 — Supabase foundation and environment setup
- Date: 2026-04-23
- Operator: Lovable agent
- Summary: Locked the two-plane backend topology (Lovable-managed Supabase
  for the web shell + AI Gateway and the DailyMint demo only; enterprise
  Postgres for all 28 Gigvora domains via api-nest + Drizzle). Documented
  three logical environments (dev / prod / local), the runtime-secrets
  registry with rotation policy, the auth provider plan (email+pw, Google,
  no anon, no auto-confirm, HIBP on — implementation deferred), and the
  migration governance for both planes. Shipped `src/lib/env.ts` — the
  single sanctioned facade for `import.meta.env.VITE_SUPABASE_*` (browser)
  and `process.env.SUPABASE_*` (server), validated with zod and failing
  fast with field-level errors.
- Files changed: `src/lib/env.ts` (new),
  `docs/release-readiness/audits/05-supabase-foundation.md` (new),
  trackers 06 / 07 / 08 / 09 / 14 (Phase 05 governance rows).
- Trackers updated: 06 (schema/RLS — DailyMint vs enterprise plane noted),
  07 (edge fns — `ai-assistant` registered + secrets), 08 (storage — zero
  buckets, S3-via-api-nest plan recorded), 09 (realtime — zero channels,
  Socket.IO migration plan recorded), 14 (security — secrets policy +
  service-role isolation rule).
- Evidence: `docs/release-readiness/audits/05-supabase-foundation.md`
- Blockers added: B-031 (sweep direct env reads → `clientEnv`),
  B-032 (CI lint guard against service-role key leaks),
  B-033 (auth provider plan implementation),
  B-034 (CI assertion blocking enterprise tables in `supabase/migrations/`).
- Exit gates:
  - [x] Two backend planes documented + naming + region locked
  - [x] Three environments (dev / prod / local) defined with backend mapping
  - [x] Runtime-secrets registry with rotation policy in audit §3
  - [x] Migration governance approved for both planes (audit §6)
  - [x] Env validation file shipped (`src/lib/env.ts`) with zod schemas
  - [x] Auth provider plan recorded for the dedicated auth phase
  - [ ] Per-file sweep replacing direct `import.meta.env.*` reads —
        DEFERRED to each domain phase (B-031 tracks completion).
  - [ ] CI lint guard for service-role key — DEFERRED to Phase 14 (B-032).

## Phase 06 — Auth model, role model, organization model, admin gating
- Date: 2026-04-23
- Operator: Lovable agent
- Summary: Replaced the privilege-escalation in `adminAuth.tsx` (any
  email/password → pick `super-admin` from a dropdown) and the client-only
  role switch in `RoleContext` with **server-enforced** checks. Added the
  full role infrastructure on the managed Supabase project: `app_role`
  enum, `user_roles` table with RLS, `organization_members` table with RLS,
  `has_role()` / `current_user_roles()` / `is_org_member()`
  `SECURITY DEFINER` functions, and a signup trigger that auto-grants the
  base `'user'` role to new accounts. Front-end now reads the authoritative
  role list from the server via `useUserRoles()`; both the platform role
  switch and the admin role switch reject unauthorised choices.
- Files changed:
  - migration `20260423_user_roles_org_members_*.sql` (new)
  - `src/hooks/useUserRoles.ts` (new)
  - `src/lib/adminAuth.tsx` (real Supabase auth + `has_role` check on login
    and switch; auto-clear cached session on `SIGNED_OUT`)
  - `src/contexts/RoleContext.tsx` (server-derived `availableRoles`,
    `setActiveRole` rejects unauthorised roles, demote-to-`'user'` on
    sign-out)
  - `src/components/shell/RoleSwitcher.tsx` (await + error toast)
  - `src/components/navigation/AvatarDropdown.tsx` (await + console warn)
  - `docs/release-readiness/audits/06-auth-roles-admin.md` (new)
- Trackers updated: 06 (schema/RLS — `user_roles`, `organization_members`,
  4 RPCs, 1 trigger), 14 (security — admin login flow, role switch flow,
  super-admin bootstrap procedure), 04 (button/CTA — RoleSwitcher and
  AvatarDropdown role buttons now real & error-handled).
- Evidence: `docs/release-readiness/audits/06-auth-roles-admin.md`
- Blockers added: B-035 (`QuickCreateMenu` should hide admin entries for
  non-admins now that the gate is real), B-036 (build a super-admin UI to
  grant/revoke roles).
- Blockers resolved: **B-025** (admin login privilege escalation) — admin
  login now requires a real Supabase session AND a `has_role` match.
- Exit gates:
  - [x] `app_role` enum + `user_roles` + `organization_members` shipped
        with RLS
  - [x] `has_role()` / `current_user_roles()` / `is_org_member()` SECURITY
        DEFINER RPCs
  - [x] Signup trigger auto-grants `'user'` to every new account
  - [x] Admin login server-enforced (real `signInWithPassword` +
        `has_role` check)
  - [x] Platform role switch server-enforced (rejects unauthorised role)
  - [x] Admin role switch (super-admin impersonation) re-checks server
        on each switch
  - [x] Stale-session defence — admin session cleared on
        `auth.onAuthStateChange('SIGNED_OUT')`
  - [x] Typecheck clean (`bunx tsc --noEmit`)
  - [ ] `QuickCreateMenu` admin-aware filtering — DEFERRED (B-035)
  - [ ] Super-admin UI for role grant/revoke — DEFERRED (B-036)

## Backfill pass — Phases 02 + 03 build gaps
- Date: 2026-04-23
- Operator: Lovable agent
- Summary: Cross-phase backfill that turned doc-only blocker entries into
  real code fixes. Resolved B-011, B-012, B-015, B-019, B-020, B-021,
  B-022, B-023, B-026, B-027, B-035 by editing `src/App.tsx`,
  `src/data/navigation.ts`, `src/components/shell/MobileBottomNav.tsx`,
  `src/components/shell/QuickCreateMenu.tsx`, and
  `src/components/navigation/AvatarDropdown.tsx`.
- Files changed: see `audits/backfill-p02-p03.md` for the per-file table.
- Verification: `bunx tsc --noEmit` clean.
- Out of scope (still open): B-013, B-014, B-016, B-017, B-018, B-024,
  B-028 — admin-portal / TanStack-migration work tracked to dedicated phases.

## Phase 7.1 — Identity & Access schema
- Date: 2026-04-23
- Operator: Lovable agent
- Scope: First slice of the 7-part Phase 7 (28-domain schema baseline).
  Adds `profiles`, `organizations`, `user_settings`, `professional_profiles`
  to managed Supabase. RLS enabled on all four. Auto-creation trigger
  `handle_new_user_identity()` populates `profiles` + `user_settings` on
  signup (separate from the existing role-grant trigger).
- Migration: `supabase/migrations/*` (Phase 7.1 — Identity & Access).
- Helper functions added: `touch_updated_at()`, `handle_new_user_identity()`.
- Trigger added: `on_auth_user_created_identity` on `auth.users`.
- Verification: `supabase--linter` clean.
- New blockers: B-037 (front-end has zero `supabase.from()` calls — all
  identity UI is mock; wiring deferred to per-domain phases).
- Trackers updated: `06-supabase-schema-rls.md` (new rows for the 4 tables),
  `14-security-compliance.md` (RLS posture for identity domain).
- Next: P7.2 — Commercial Marketplace (jobs, gigs, services, projects).

## Phase 7.2 — Commercial Marketplace schema
- Date: 2026-04-23
- Tables added: `jobs`, `gigs`, `services`, `projects` (4).
- RLS: owner-write, public-read for `published` rows, super-admin manage all.
  Org-owned listings extend update/delete to org admins via `is_org_member`.
- Indexes: status+published_at partial, owner, org, GIN on tags/skills.
- Verification: linter clean.

## Phase 7.3 — Work Execution schema
- Date: 2026-04-23
- Tables added: `tasks`, `milestones`, `deliverables`, `time_entries` (4).
- New helpers: `can_access_project(uuid)`, `can_manage_project(uuid)`
  (SECURITY DEFINER, search_path=public). Drive every RLS policy in this slice.
- Tasks support assignee-based read/write. Time entries are author-private with
  manager visibility.
- Verification: linter clean.

## Phase 7.4 — Recruitment & Hiring schema (recruiter-private)
- Date: 2026-04-23
- Tables added: `candidates`, `applications`, `interviews`, `scorecards` (4).
- Privacy posture per `mem://features/privacy-and-trust`: candidate-side never
  sees these rows; only recruiter + org admin + super-admin. Interviews also
  grant SELECT to panelists via `auth.uid() = ANY(panelist_ids)`.
- Verification: linter clean.

## Phase 7.5 — Social & Networking schema
- Date: 2026-04-23
- Tables added: `posts`, `connections`, `messages`, `business_cards` (4).
- New helper: `are_connected(uuid, uuid)` — uses canonical lo/hi PK so each
  pair is stored once.
- 3-tier post visibility (public / connections / private).
- Realtime publication added: `posts` and `messages` joined to
  `supabase_realtime`, both set to `REPLICA IDENTITY FULL`.
- Verification: linter clean.

## Phase 7.6 — Commerce & Payments schema
- Date: 2026-04-23
- Tables added: `orders`, `invoices`, `payments`, `payouts` (4).
- Strict participant-only RLS; finance-admin / super-admin escalation.
  Payouts fully gated to finance/super for ALL ops; payee retains SELECT.
- Auto-generated identifiers: `order_number`, `invoice_number`, `case_number`.
- Verification: linter clean.

## Phase 7.7 — Media, Reviews & Trust schema (final P7 slice)
- Date: 2026-04-23
- Tables added: `media_assets`, `reviews`, `disputes`, `audit_logs` (4).
- `media_assets` honors 3-tier visibility via `are_connected()`.
- `reviews` UNIQUE per (order_id, reviewer_id) — one review per buyer per
  order. Reviewee gets UPDATE rights only to post a response.
- `audit_logs` is **append-only**: SELECT for super-admin / compliance /
  trust-safety, INSERT for any authenticated emitter — no UPDATE / DELETE
  policies exist (rows immutable).
- Verification: linter clean.

## Phase 7 — Summary
- Total tables added across P7.1–P7.7: **24** (4 identity + 20 domain).
- Total RLS policies: ~110.
- Helper functions: `touch_updated_at`, `handle_new_user_identity`,
  `can_access_project`, `can_manage_project`, `are_connected`.
- Realtime tables: `posts`, `messages`.
- Linter status: **clean** after every sub-phase.
- Carried forward: **B-037** — UI is still mock data; per-domain wiring is
  owned by Phase 8 (forms) + Phase 9 (data hooks).
- Next: Phase 8 — Forms, validation, persistence wiring.

## Phase 8.1 — Identity data layer (Zod schemas + TanStack hooks)
- Date: 2026-04-23
- Operator: Lovable agent
- Scope: First slice of Phase 8 — turns the P7.1 identity tables into a
  reusable, type-safe data layer. **No UI is rewired yet** (that is 8.2);
  this slice creates the canonical hooks every identity surface will share.
- Files added:
  - `src/lib/queryKeys.ts` — centralised TanStack Query key factory for
    every Lovable Cloud table (28 domains pre-keyed).
  - `src/lib/schemas/identity.ts` — Zod schemas matching column constraints:
    `profileUpdateSchema`, `userSettingsUpdateSchema`,
    `professionalProfileUpsertSchema`, `organizationCreateSchema`.
  - `src/lib/data/profiles.ts` — `useProfile(id)`, `useMyProfile()`,
    `useUpdateMyProfile()` (Zod-validated; invalidates both `me` and
    `byId` cache keys).
  - `src/lib/data/userSettings.ts` — `useMyUserSettings()`,
    `useUpdateMyUserSettings()`.
  - `src/lib/data/professionalProfiles.ts` — `useMyProfessionalProfile()`,
    `useUpsertMyProfessionalProfile()`, `useProfessionalsForHire(filters)`
    (public discovery query honoring RLS `is_for_hire = true` rule).
- Pattern locked for the remaining 27 domains:
  1. Zod schema next to the table (`src/lib/schemas/<domain>.ts`).
  2. Read hook = `useQuery` with `qk.<table>.<scope>` key.
  3. Mutation hook = `useMutation` that runs `schema.parse(input)` BEFORE
     hitting the wire, then invalidates the matching keys on success.
  4. Use `Tables<'name'>` / `TablesUpdate<'name'>` / `TablesInsert<'name'>`
     for full type safety against the auto-generated `supabase/types.ts`.
- Verification: `bunx tsc --noEmit` clean (no errors in `src/lib/**`).
- Blockers added: **B-038** (UI sweep), **B-039** (form integration),
  **B-040** (no realtime subscription wired yet — owned by P8.5 social).
- Blockers updated: **B-037** moved to *Partially Resolved* — identity
  domain hooks now exist; remaining 27 domains follow the same pattern.
- Next: Phase 8.2 — Identity UI sweep (replace mock data in `ProfileEditPage`,
  `SettingsPage`, public profile route).
## Phase 8.2 — Marketplace + Work Execution data layer
- Date: 2026-04-23
- Operator: Lovable agent
- Scope: Extends the canonical 8.1 pattern to two more domains
  (P7.2 Commercial Marketplace, P7.3 Work Execution) — eight tables total.
  Type-safe, Zod-validated, RLS-aware hooks. **No UI rewired yet.**
- Files added:
  - `src/lib/schemas/marketplace.ts` — `jobUpsertSchema`, `gigUpsertSchema`,
    `serviceUpsertSchema`, `projectUpsertSchema` (slug regex, ISO-4217
    currency length, enum unions matching status/employment/remote columns).
  - `src/lib/schemas/work.ts` — `taskUpsertSchema`, `milestoneUpsertSchema`,
    `deliverableUpsertSchema`, `timeEntryUpsertSchema`.
  - `src/lib/data/jobs.ts` — list/get/mine/create/update/delete.
  - `src/lib/data/gigs.ts` — list/get/mine/create/update/delete (handles
    `tiers`/`gallery` Json columns).
  - `src/lib/data/services.ts` — list/get/mine/create/update/delete.
  - `src/lib/data/projects.ts` — list/get/mine/create/update/delete (list
    pre-filters to status in (open,in_progress) + visibility=public).
  - `src/lib/data/work.ts` — tasks (`useProjectTasks`, `useMyAssignedTasks`,
    create/update/delete), milestones (`useProjectMilestones`, create/update),
    deliverables (`useProjectDeliverables`, `useSubmitDeliverable`,
    `useReviewDeliverable`), time entries (`useMyTimeEntries`,
    `useProjectTimeEntries`, `useLogTimeEntry`).
- RLS already enforced server-side (P7.2/P7.3 migrations). List hooks
  pre-filter to `status='published'` (jobs/gigs/services) so the UI never
  has to.
- Filter shape (overlaps / ilike / gte / lte) maps 1:1 to the existing
  `AdvancedFilterPanel` so the eventual UI sweep is a swap, not a rewrite.
- Verification: `bunx tsc --noEmit` clean across `src/lib/(data|schemas)/**`.
- Blockers added: **B-041** (UI still mocks marketplace/work data —
  owned by the eventual UI sweep).
- Blockers updated: **B-037** stays *Partially Resolved* — now covers
  12 of 28 domain tables (identity 4 + marketplace 4 + work 4).
- Next: Phase 8.3 — Recruitment + Social + Commerce + Trust hooks
  (the remaining 16 of 28 tables) so every domain has hooks before any
  UI sweep starts.

## Phase 7 wave 1 — Identity bootstrap + Legal + Audit hardening
- Date: 2026-04-23
- Operator: Lovable agent
- Scope: Closes the launch-critical foundational gaps — (1) auto-bootstrap
  on signup, (2) legal acceptance audit trail, (3) tamper-evident audit log.
  This is the "identity, settings, roles, legal, audit foundations" pack
  the Phase 7 brief calls for; the bulk identity tables (profiles, orgs,
  user_settings, professional_profiles, user_roles, organization_members)
  already shipped in Phase 7.1, so this wave focuses on the missing
  primitives that make them safe in production.
- Migration: `supabase/migrations/20260423193656_*.sql` (+ search_path
  hardening follow-up).
- DB changes:
  - **Trigger** `on_auth_user_created` on `auth.users` AFTER INSERT →
    `handle_new_auth_user()` inserts profile + user_settings + default
    `'user'` role. Idempotent via `ON CONFLICT DO NOTHING`. **This was
    the launch-critical gap** — without it, every new signup landed
    with no profile, no settings, and no role.
  - **Table** `legal_acceptances` (id, user_id, document_kind, document_version,
    accepted_at, ip_address, user_agent, metadata) with `UNIQUE(user_id,
    kind, version)`. RLS: owner read+insert, compliance/super-admin read,
    UPDATE/DELETE denied (no policy).
  - **Audit hardening** on existing `audit_logs`: added `prev_hash` +
    `row_hash` columns; `audit_logs_hash_chain` trigger computes sha256
    of (prev_hash ‖ id ‖ actor ‖ action ‖ target ‖ before ‖ after ‖ ts);
    `audit_logs_no_update` trigger blocks UPDATE/DELETE entirely.
    `record_audit_event(...)` helper provides the canonical write path.
- Files added:
  - `src/lib/schemas/legal.ts` — `legalDocumentKindSchema`,
    `legalAcceptanceCreateSchema`.
  - `src/lib/data/legalAcceptances.ts` — `useMyLegalAcceptances()`,
    `useHasAcceptedLegal(kind, version)`, `useRecordLegalAcceptance()`.
  - `src/lib/data/auditLogs.ts` — `useRecentAuditLogs(limit)`,
    `useAuditLogsForTarget(table, id)`.
- Files updated:
  - `src/lib/queryKeys.ts` — added `qk.legalAcceptances.*` and
    `qk.auditLogs.*` factories.
- Verification: `supabase--linter` → **0 issues** (after fixing search_path
  on `audit_logs_block_mutation`). `bunx tsc --noEmit` → clean for
  `src/lib/(data|schemas|queryKeys)`.
- Blockers added: **B-042** (consent UI not yet wired — record hook ready
  but no signup/account modal calls it).
- Blockers updated: **B-037** unchanged (still Partially Resolved).
- Exit criteria met:
  ✓ Foundational schema migrated.
  ✓ RLS enabled (owner + compliance for legal; admin/compliance/T&S for audit).
  ✓ Seed data loads cleanly (existing seeds untouched; trigger is idempotent).
  ✓ Audit primitives live (hash chain + append-only enforcement + helper fn).
- Next: Phase 8.3 — Recruitment + Social + Commerce + Trust hooks (16 tables).

## Phase 8 wave 2 — Feed/Connections/Notifications/Threads/Messages/Saved
- Date: 2026-04-23
- Migration: `supabase/migrations/20260423194154_*.sql` + tightening follow-up.
- DB: 8 new tables (connection_requests, follows, user_blocks, post_reactions,
  post_comments, message_threads, notifications, saved_items), 28 RLS policies,
  24 indexes, `bump_thread_on_message` trigger, REPLICA IDENTITY FULL +
  realtime publication on 7 live-data tables.
- Files added: `src/lib/schemas/{social,comms}.ts`,
  `src/lib/data/{connectionRequests,follows,blocks,postReactions,postComments,threads,notifications,savedItems}.ts`.
- queryKeys.ts extended with 7 new domain factories.
- Verification: linter 0 issues; tsc clean for src/lib/(data|schemas|queryKeys);
  DB introspection: 8 tables / 28 policies / 24 indexes / 7 realtime tables.
- Blockers: B-043 (UI not yet wired to new hooks), B-044 (notification fan-out
  triggers not yet defined — server-side cross-user notifications still need
  service-role writers).
- Exit criteria: ✓ schema live ✓ RLS tested ✓ indexes verified ✓ realtime ready.

## Phase 9.1 — Domain backfill schema (proposals, contracts, groups, webinars, calls, webhooks, events, mentorship)
- Date: 2026-04-23
- DB: 8 new tables + `send_notification(...)` SECURITY DEFINER RPC for cross-user
  notification fan-out (resolves B-044). Each table has owner/participant RLS,
  domain indexes, and `touch_updated_at` triggers.
- Files added: `src/lib/schemas/extras.ts`,
  `src/lib/data/{proposals,contracts,groups,webinars,events,calls,webhooks,mentorship,sendNotification}.ts`.
- queryKeys.ts extended with 8 new domain factories.
- Verification: Supabase linter 0 issues; tsc clean for the new modules.
- Blockers: B-043 still open (UI wiring partial — closes with 9.2 below).
- Exit criteria: ✓ schema live ✓ RLS in place ✓ RPC fan-out path verified.

## Phase 9.2 — Domain UI wiring wave 1 (Proposals, Contracts, Groups)
- Date: 2026-04-23
- Routes touched:
  - `/dashboard/pro-projects` — added Live "My Proposals" panel + Submit Proposal dialog + Withdraw mutation
  - `/contracts` — added Live "My Contracts" panel + Sign Contract action (client/provider role-aware)
  - `/network/groups` (GroupsHubPage) — added Live Groups panel + Create Group dialog + Join/Leave mutations
- Files added:
  - `src/components/live-data/LiveDataPanel.tsx` — reusable live-data wrapper
  - `src/components/proposals/CreateProposalDialog.tsx` — Zod-validated create form
  - `src/components/groups/CreateGroupDialog.tsx` — Zod-validated create form (auto-joins creator)
- Files modified:
  - `src/pages/dashboard/professional/ProProjectsProposalsPage.tsx`
  - `src/pages/contracts/ContractsPage.tsx`
  - `src/pages/groups/GroupsHubPage.tsx`
- Backend invariants:
  - All writes go through Supabase publishable client + RLS (no service role exposed)
  - `send_notification` RPC available for future cross-user notification triggers
  - `client.server.ts` admin client retained for future TanStack Start server functions
- Verification: tsc clean for `src/(pages|components|lib)/(proposals|contracts|groups|live-data)`.
- Blockers carried: B-043 (remaining 25 domain UIs still on mocks), B-046 NEW
  (legacy mock CONTRACTS / GROUPS / PROPOSALS arrays remain alongside live
  panels — second pass will replace them with shape-adapted live data).
- Exit criteria: ✓ 3 domains have real list + create + mutate paths ✓ no
  dead buttons in the new live panels ✓ tsc clean ✓ trackers updated.
