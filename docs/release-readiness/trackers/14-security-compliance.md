# Tracker 14 — Security, Compliance, Audit, Encryption

## Schema

| Control | Surface | Mechanism | Owner phase | Test/proof | Status | Phase | Evidence |
|---------|---------|-----------|-------------|------------|--------|-------|----------|

## Standing controls (initial)

| Control | Surface | Mechanism | Owner phase | Test/proof | Status | Phase | Evidence |
|---------|---------|-----------|-------------|------------|--------|-------|----------|
| Roles in dedicated table | `public.user_roles` | `has_role()` SECURITY DEFINER fn + RLS | Phase 03 | pending | Not started | 01 | — |
| Server-side admin checks | All `/admin/*` server fns | `has_role(auth.uid(),'admin')` | Phase 13 | pending | Not started | 01 | — |
| Webhook signature verification | `/api/public/*` | HMAC + `timingSafeEqual` | Phase 11 | pending | Not started | 01 | — |
| Zod input validation | All forms + edge fns | `zod` package | Phase 02 | pending | Not started | 01 | BLOCKERS.md#B-005 |
| Storage RLS per-user prefix | All buckets | `(storage.foldername(name))[1] = auth.uid()::text` | Phase 08 | pending | Not started | 01 | BLOCKERS.md#B-002 |
| Auth lockout (5 attempts) | `/auth` | client + edge fn counter | Phase auth | pending | Not started | 01 | — |
| Env validation (zod) | client+server | `src/lib/env.ts` (zod schemas, fail-fast) | Phase 05 | shipped | Verified | 05 | `audits/05-supabase-foundation.md` §5 |
| Service-role isolation | server only | `client.server.ts` (Proxy lazy-init) + audit doc rule banning imports outside `src/integrations/supabase/**` | Phase 05 | doc-only; CI guard pending B-032 | In progress | 05 | `audits/05-supabase-foundation.md` §3 |
| Secrets rotation policy | all secrets | `secrets--update_secret` for app secrets; `ai_gateway--rotate_lovable_api_key` for `LOVABLE_API_KEY`; `supabase--rotate_api_keys` for Supabase keys | Phase 05 | documented | Verified | 05 | `audits/05-supabase-foundation.md` §3 |
| Migration governance | both planes | managed Supabase via `supabase--migration` only; enterprise via `packages/db/migrations/*.sql` only | Phase 05 | documented; CI assertion pending B-034 | In progress | 05 | `audits/05-supabase-foundation.md` §6 |
| Auth provider hardening (no anon, no auto-confirm, HIBP on, lockout) | `/auth` | `supabase--configure_auth` (deferred to dedicated phase) | Phase auth | planned | Not started | 05 | `audits/05-supabase-foundation.md` §4; B-033 |
| Admin login server-enforced | `/admin/login` | `adminAuth.login` calls `supabase.auth.signInWithPassword` then `has_role(user_id, role)`; rolls back via `signOut()` if either fails | Phase 06 | shipped | Verified | 06 | `audits/06-auth-roles-admin.md` §2,§4 |
| Platform role switch server-enforced | avatar dropdown / RoleSwitcher | `RoleContext.setActiveRole` rejects roles not in server-derived `availableRoles`; demotes to `'user'` on sign-out | Phase 06 | shipped | Verified | 06 | `audits/06-auth-roles-admin.md` §2 |
| Admin role switch (super-admin impersonation) server-enforced | AdminShell role switcher | `adminAuth.switchRole` re-calls `has_role()` on every switch | Phase 06 | shipped | Verified | 06 | `audits/06-auth-roles-admin.md` §2 |
| Stale-session defence | admin session cache | `AdminAuthProvider` clears `sessionStorage` on `supabase.auth.onAuthStateChange('SIGNED_OUT')` | Phase 06 | shipped | Verified | 06 | `audits/06-auth-roles-admin.md` §2 |
| Super-admin bootstrap procedure | manual SQL | documented in audit §8; no UI yet (tracked as B-036) | Phase 06 | documented | In progress | 06 | `audits/06-auth-roles-admin.md` §8 |