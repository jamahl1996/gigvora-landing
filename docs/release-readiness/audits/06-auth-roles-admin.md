# Phase 06 — Auth model, role model, organization model, and admin gating

Captured: 2026-04-23. Source of truth for: how auth, roles, org membership,
and admin gating actually work after Phase 06.

## 1. Architecture

| Layer | What it does | File |
|-------|--------------|------|
| Lovable Cloud auth | Email + password sign-in, session persistence, JWT | managed by `supabase.auth.*` |
| `app_role` enum    | Canonical list of every grantable role | migration `20260423_*.sql` |
| `user_roles` table | One row per (user, role) grant | migration |
| `has_role()` RPC   | `SECURITY DEFINER` boolean check — single source of truth | migration |
| `current_user_roles()` RPC | Returns the array of roles for `auth.uid()` | migration |
| `organization_members` table | (user, org_id, member_role) for tenant-style permissions | migration |
| `is_org_member()` RPC | `SECURITY DEFINER` ranked membership check | migration |
| `useUserRoles()` hook | Front-end binding — fetches roles via the RPC | `src/hooks/useUserRoles.ts` |
| `RoleContext`      | Holds the *active* platform role; switch is server-checked | `src/contexts/RoleContext.tsx` |
| `AdminAuthContext` | Holds the verified admin session; login + switch are server-checked | `src/lib/adminAuth.tsx` |
| `AdminGuard`       | Redirects unauthenticated visitors to `/admin/login` | `src/components/layout/AdminGuard.tsx` |

## 2. What Phase 06 fixed (security-critical)

| Blocker | Before Phase 06 | After Phase 06 |
|---------|-----------------|-----------------|
| **B-025** Client-only role switching in `AvatarDropdown` | `setActiveRole(role)` flipped local state with no check — anyone could "become" Enterprise in the UI. | `RoleContext.setActiveRole(role)` is async; throws if `role` is not in `availableRoles` (derived from `current_user_roles()` RPC). Switcher catches and shows a toast. |
| **B-023** Admin paths exposed in `QuickCreateMenu` | Admin paths visible to standard users. | UI surfaces still need a sweep, but the underlying gate is now server-enforced — clicking through lands on `AdminGuard` which redirects to `/admin/login`, and login itself rejects non-admins. (Remaining UI cleanup tracked as **B-035**.) |
| **`adminAuth.login` privilege escalation** | Accepted any email/password and let the user pick `super-admin` from a dropdown. | Calls `supabase.auth.signInWithPassword`, then `has_role(user_id, role)`. If either fails, the auth session is rolled back via `supabase.auth.signOut()` so we never leave a half-authenticated user behind. |
| **`adminAuth.switchRole` trust-the-client** | Local-state-only — a tampered front end could flip a non-super-admin's `isSuperAdmin` flag. | Re-calls `has_role()` on every switch. Rejects if Postgres says no. |
| **Stale admin session after sign-out** | Admin session sat in `sessionStorage` even after the underlying Supabase session ended. | `AdminAuthProvider` subscribes to `supabase.auth.onAuthStateChange`; clears session storage on `SIGNED_OUT`. |

## 3. Roles taxonomy

### Platform roles (the avatar dropdown / `RoleContext`)
- `user` — public default. Auto-granted to every new signup via the
  `handle_new_user_default_role` trigger.
- `professional` — granted manually by an admin (or, in a future phase, by
  a paid upgrade flow).
- `enterprise` — granted manually by an admin (org owner / billing).

### Admin roles (the `/admin` terminal / `AdminAuthContext`)
- `super-admin` — full access, can switch role context, can grant/revoke roles.
- `cs-admin`, `finance-admin`, `moderator`, `trust-safety`, `dispute-mgr`,
  `ads-ops`, `compliance`, `marketing-admin` — scoped admin capabilities. The
  `AdminShell` sidebar already filters menu items per role; the gate now
  checks `has_role()` before granting access.

## 4. Auth flow (admin login)

```
/admin/login
  ├─ user enters email + password
  ├─ supabase.auth.signInWithPassword     ←─ rejects bad creds (HIBP, lockout)
  ├─ user picks env (production/staging/sandbox)
  ├─ user picks role from INTERNAL_ROLES dropdown
  ├─ supabase.rpc('has_role', { _user_id, _role })   ←─ rejects unauthorised role
  ├─ if role mismatch → supabase.auth.signOut() + error toast
  └─ on success → AdminUser written to sessionStorage, redirect to ?redirect=
```

## 5. Org membership model

`organization_members` is keyed by `organization_id text` (not yet a real FK
— the `organizations` table itself lives in the enterprise Postgres per
`mem://tech/no-domain-code-in-supabase`). The shape is final and the RLS
policies are in place; the FK will be added when the organisation domain
gets its own phase.

`member_role` ranks: `owner > admin > member > viewer`. `is_org_member(uid,
org_id, min_role)` returns true only if the member's role meets or exceeds
the requested rank.

## 6. RLS summary

### `user_roles`
| Operation | Who | Policy |
|-----------|-----|--------|
| SELECT (own) | any authenticated user | `user_id = auth.uid()` |
| SELECT (all) | super-admin | `has_role(auth.uid(), 'super-admin')` |
| INSERT | super-admin only | `with check (has_role(auth.uid(), 'super-admin'))` |
| DELETE | super-admin only | `using (has_role(auth.uid(), 'super-admin'))` |

### `organization_members`
| Operation | Who | Policy |
|-----------|-----|--------|
| SELECT (own) | member of self | `user_id = auth.uid()` |
| SELECT (org) | org admin/owner | `is_org_member(auth.uid(), organization_id, 'admin')` |
| SELECT (all) | super-admin | `has_role(auth.uid(), 'super-admin')` |
| ALL writes | org admin/owner OR super-admin | combined `is_org_member(...) or has_role(...)` policies |

## 7. Verification

```bash
# 1. Migration is in place
ls supabase/migrations/ | grep -i "user_roles\|role" || echo "expected the Phase 06 migration"

# 2. has_role + current_user_roles + is_org_member functions exist
# (run in the Supabase SQL editor or via the read_query tool)
#   select proname from pg_proc where proname in
#     ('has_role','current_user_roles','is_org_member','handle_new_user_default_role');

# 3. Typecheck stays clean after the API change to setActiveRole / switchRole
bunx tsc --noEmit

# 4. Manual smoke
#   a. sign up a fresh user → confirm a 'user' row appears in user_roles
#      (via trigger handle_new_user_default_role)
#   b. visit /admin/login with that user → role dropdown rejects super-admin
#      with "This account does not have the 'super-admin' admin role."
#   c. grant super-admin via SQL: insert into user_roles values
#      (gen_random_uuid(), '<uid>', 'super-admin', now(), '<uid>');
#   d. retry → login succeeds, AdminShell renders.
```

## 8. Bootstrapping the first super-admin

There is intentionally no UI for self-promotion. Manual steps:

1. Sign up the first admin user via `/auth/sign-up`.
2. In the Supabase SQL editor (or via `code--exec` `supabase--insert`):
   ```sql
   insert into public.user_roles (user_id, role)
   values ('<auth.users.id>', 'super-admin');
   ```
3. From then on, that super-admin can grant any role via the (future)
   admin role-grant UI — or via the same SQL pattern.

## 9. Counters

| Metric | Before | After |
|--------|-------:|------:|
| Server-checked role grants | 0 | 1 (`has_role`) |
| Server-checked org membership | 0 | 1 (`is_org_member`) |
| Tables with RLS in this project | DailyMint demo only | DailyMint demo + 2 (`user_roles`, `organization_members`) |
| Admin login privilege-escalation surfaces | 1 (any creds → super-admin) | 0 |
| Client-only role-switch surfaces | 2 (`RoleContext`, `AdminAuthContext`) | 0 |
| New blockers | — | 2 (B-035, B-036) |