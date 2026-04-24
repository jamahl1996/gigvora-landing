# Tracker 06 — Supabase Schema, Migrations, Seeders, RLS

## Schema

| Table | Migration | RLS? | Policies | Seeded? | Consumed by | Status | Phase | Evidence |
|-------|-----------|------|----------|---------|-------------|--------|-------|----------|

## Baseline (Phase 01)

- `public.*` tables: **0**.
- Migrations directory contains only the destructive Phase 0 cleanup
  migration (drops legacy DailyMint tables).

## Rows

| Table | Migration | RLS? | Policies | Seeded? | Consumed by | Status | Phase | Evidence |
|-------|-----------|------|----------|---------|-------------|--------|-------|----------|
| _Phase 01: tracker initialised._ | — | — | — | — | — | Not started | 01 | BLOCKERS.md#B-001 |
| _Phase 05: backend topology locked — managed Supabase holds DailyMint demo + auth + AI gateway only; all 28 enterprise domains live in `packages/db` Drizzle schemas reached via api-nest. No new tables in this phase._ | — | — | — | — | — | Verified | 05 | `audits/05-supabase-foundation.md` §1 |
| habits (DailyMint demo)        | `supabase/migrations/20260408144934_*.sql` | yes | per-user owner | demo | DailyMint demo UI only | Verified | 05 | managed Supabase, NOT a Gigvora table |
| habit_logs (DailyMint demo)    | `supabase/migrations/20260408144934_*.sql` | yes | per-user owner | demo | DailyMint demo UI only | Verified | 05 | managed Supabase, NOT a Gigvora table |
| profiles (DailyMint demo)      | `supabase/migrations/20260408144934_*.sql` | yes | per-user owner | demo | DailyMint demo UI only | Verified | 05 | managed Supabase, NOT a Gigvora table |
| Gigvora `identities` (planned) | `packages/db/migrations/0001_init.sql` (planned) | n/a (RLS via api-nest) | api-nest tenant scoping | seed via api-nest | api-nest + SDK | Not started | 05 | `packages/db/src/schema/identity.ts` |
| user_roles | Phase 06 migration | yes | own-row read; super-admin read-all/insert/delete via `has_role()` | trigger `handle_new_user_default_role` grants `'user'` on signup | `useUserRoles()` hook, `adminAuth.login`, `adminAuth.switchRole`, `RoleContext.setActiveRole` | Verified | 06 | `audits/06-auth-roles-admin.md` §6 |
| organization_members | Phase 06 migration | yes | own membership read; org admin/owner read+manage; super-admin read-all/manage-all | none (manual seed for now) | future org-management UI | Verified | 06 | `audits/06-auth-roles-admin.md` §5 |
| _Functions: `has_role(uuid, app_role)`, `current_user_roles()`, `is_org_member(uuid, text, org_member_role)`, `handle_new_user_default_role()` — all `SECURITY DEFINER` with `set search_path = public`._ | Phase 06 migration | n/a | n/a | n/a | adminAuth, RoleContext, useUserRoles, signup trigger | Verified | 06 | `audits/06-auth-roles-admin.md` §1 |
| profiles | Phase 7.1 migration | yes | public read when `is_public`; owner full CRUD; super-admin read-all | trigger `handle_new_user_identity` | (UI wiring pending B-037) | Verified | 7.1 | linter clean |
| organizations | Phase 7.1 migration | yes | public read when `is_public`; org admins update; org owners delete; super-admin manage all | none yet | (UI wiring pending B-037) | Verified | 7.1 | linter clean |
| user_settings | Phase 7.1 migration | yes | owner-only ALL | trigger `handle_new_user_identity` | (UI wiring pending B-037) | Verified | 7.1 | linter clean |
| professional_profiles | Phase 7.1 migration | yes | public read when `is_for_hire`; owner full CRUD | none | (UI wiring pending B-037) | Verified | 7.1 | linter clean |
| _Functions added 7.1: `touch_updated_at()`, `handle_new_user_identity()` — both `SECURITY DEFINER` with `search_path=public`. Triggers: `trg_*_touch` for updated_at on each table; `on_auth_user_created_identity` on `auth.users`._ | Phase 7.1 | n/a | n/a | n/a | signup flow, all 4 tables | Verified | 7.1 | linter clean || legal_acceptances | Phase 7-w1 migration `20260423193656_*` | yes | owner read+insert; super-admin & compliance read-all; **no UPDATE/DELETE policies** (append-only by absence) | none — written at signup/consent flow | `useMyLegalAcceptances`, `useHasAcceptedLegal`, `useRecordLegalAcceptance` (`src/lib/data/legalAcceptances.ts`) | Verified | 7-w1 | linter clean |
| audit_logs (hardened) | Phase 7-w1 migration `20260423193656_*` | yes (existing) | compliance/super-admin/trust-safety read; authenticated insert; **UPDATE/DELETE blocked by trigger** | none | `useRecentAuditLogs`, `useAuditLogsForTarget` (`src/lib/data/auditLogs.ts`); writers via `record_audit_event()` SQL helper | Verified | 7-w1 | linter clean |
| _Functions added 7-w1: `handle_new_auth_user()`, `audit_logs_hash_chain()`, `audit_logs_block_mutation()`, `record_audit_event(action,target_table,target_id,before,after,reason,metadata)` — all `SECURITY DEFINER` with `search_path=public`. Triggers: `on_auth_user_created` (auth.users → profile+settings+role bootstrap), `audit_logs_hash_chain_trg` (BEFORE INSERT — prev_hash + sha256 row_hash), `audit_logs_no_update` (BEFORE UPDATE/DELETE → raises)._ | Phase 7-w1 | n/a | n/a | n/a | signup flow, audit log integrity | Verified | 7-w1 | linter clean |
| connection_requests | P8-w2 | yes | requester+recipient SELECT/UPDATE; requester INSERT/DELETE | realtime ✓ | `useIncoming/Outgoing/Send/Respond` (`src/lib/data/connectionRequests.ts`) | Verified |
| follows             | P8-w2 | yes | public SELECT; self INSERT/DELETE | n/a | `useFollowers/Following/IsFollowing/Follow/Unfollow` (`src/lib/data/follows.ts`) | Verified |
| user_blocks         | P8-w2 | yes | blocker-only SELECT/INSERT/DELETE | n/a | `useMyBlocks/Block/Unblock` (`src/lib/data/blocks.ts`) | Verified |
| post_reactions      | P8-w2 | yes | readable when post readable; self INSERT/DELETE | realtime ✓ | `usePostReactions/React/Unreact` (`src/lib/data/postReactions.ts`) | Verified |
| post_comments       | P8-w2 | yes | readable when post readable; self INSERT/UPDATE; self+moderator DELETE; soft-delete | realtime ✓ | `usePostComments/Create/Update/Delete` (`src/lib/data/postComments.ts`) | Verified |
| message_threads     | P8-w2 | yes | participants only; auto-bumped by `bump_thread_on_message` trigger | realtime ✓ | `useMyThreads/Thread/CreateThread/ArchiveThread` (`src/lib/data/threads.ts`) | Verified |
| notifications       | P8-w2 | yes | self SELECT/INSERT/UPDATE/DELETE (cross-user fan-out via server role) | realtime ✓ | `useMyNotifications/Unread/MarkRead/MarkAll/Delete` (`src/lib/data/notifications.ts`) | Verified |
| saved_items         | P8-w2 | yes | self-only all ops | n/a | `useMySavedItems/IsSaved/Save/Unsave` (`src/lib/data/savedItems.ts`) | Verified |
