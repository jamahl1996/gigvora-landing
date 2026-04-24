# Tracker 04 — Button & CTA Wiring Matrix

Every button/CTA must resolve to one of: route navigation, mutation
(server function / edge function), drawer/inspector open, or
intentional no-op (must be marked `decorative` with reason).

## Schema

| Page | Selector / label | Action type | Target | Status | Phase | Evidence |
|------|------------------|-------------|--------|--------|-------|----------|

`Action type` ∈ { `route`, `mutation`, `drawer`, `external`, `decorative` }

## Baseline (Phase 01)

- Total `<Button>` usages in `src/pages` + `src/components`: **4,670**
- Audit estimate of dead clicks (no real handler): **~2,082**
- Tracker rows: 0 → grows during each domain phase.

## Rows

| Page | Selector / label | Action type | Target | Status | Phase | Evidence |
|------|------------------|-------------|--------|--------|-------|----------|
| _Phase 01: tracker initialised. Wiring rows added per domain phase._ | — | — | — | Not started | 01 | audits/01-route-baseline.md |
| _Phase 04: shell-level back/breadcrumb mounted in all 5 shells; `EmptyStateCTA` primitive shipped with safe-default `Back to dashboard` action._ | — | — | — | Verified | 04 | `audits/04-back-nav-breadcrumb.md` |
| All shells | AutoBackNav "Back" button | route | `navigate(-1)` then breadcrumb chain | In progress | 04 | `src/components/shell/AutoBackNav.tsx` |
| All shells | AutoBackNav Home icon | route | `/dashboard` | In progress | 04 | `src/components/shell/AutoBackNav.tsx` |
| Shared primitive | EmptyStateCTA primary action | route | per-page | In progress | 04 | `src/components/shell/EmptyStateCTA.tsx` |
| Shared primitive | EmptyStateCTA secondary action (default) | route | `/dashboard` | In progress | 04 | `src/components/shell/EmptyStateCTA.tsx` |
| AvatarDropdown | Role row buttons (User / Professional / Enterprise / Admin) | server-checked role switch | `RoleContext.setActiveRole(role)` — throws if user lacks role | Verified | 06 | `src/components/navigation/AvatarDropdown.tsx`; `audits/06-auth-roles-admin.md` §2 |
| RoleSwitcher (header) | Role dropdown items | server-checked role switch | `RoleContext.setActiveRole(role)` with success/error toast | Verified | 06 | `src/components/shell/RoleSwitcher.tsx`; `audits/06-auth-roles-admin.md` §2 |
| `/admin/login` | "Authenticate" button | real auth | `supabase.auth.signInWithPassword` then continue to MFA/role | Verified | 06 | `src/pages/admin/InternalAdminLoginPage.tsx`; `audits/06-auth-roles-admin.md` §4 |
| `/admin/login` Role step | "Enter Console" | server-checked role grant | `adminAuth.login()` → `has_role` RPC; signOut on failure | Verified | 06 | `src/lib/adminAuth.tsx`; `audits/06-auth-roles-admin.md` §4 |
| AdminShell role switcher | Role pills (super-admin only) | server-checked impersonation | `adminAuth.switchRole()` → re-checks `has_role` | Verified | 06 | `src/lib/adminAuth.tsx`; `audits/06-auth-roles-admin.md` §2 |