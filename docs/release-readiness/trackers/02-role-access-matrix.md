# Tracker 02 — Role × Menu × Page Access Matrix

Defines which role sees which menu item and which route on which shell.

## Roles

- `guest` — unauthenticated visitor (redirected to `/showcase/*`)
- `user` — personal account
- `professional` — paid pro tier
- `enterprise` — org member
- `admin` — internal admin terminal only
- `super_admin` — incident-mode + governance toggles

## Schema

| Menu item | Route | Shell | guest | user | professional | enterprise | admin | super_admin | Server-enforced? | Status | Phase | Evidence |
|-----------|-------|-------|-------|------|--------------|------------|-------|-------------|------------------|--------|-------|----------|

## Rows

| Menu item | Route | Shell | guest | user | professional | enterprise | admin | super_admin | Server-enforced? | Status | Phase | Evidence |
|-----------|-------|-------|-------|------|--------------|------------|-------|-------------|------------------|--------|-------|----------|
| _Phase 01: tracker initialised. Population starts when role tables land in Phase 03 (auth + roles)._ | — | — | — | — | — | — | — | — | — | Not started | 01 | — |
| _Phase 03: 19 nav surfaces inventoried, 12 placement bugs (D-001…D-018) opened, 22 `/admin/*` paths flagged for migration to canonical `/internal/*`, 9 alias-paths still surfaced from menus, 7 admin-only orphan routes identified._ | — | — | — | — | — | — | — | — | client-only (no server enforcement yet — see B-025) | Verified | 03 | `audits/03-navigation-audit.md` |
| Public top-bar (N-01) | `/`, `/enterprise-connect`, `/auth?mode=signin`, `/auth?mode=signup` | `public` | ✅ | — | — | — | — | — | n/a | In progress | 03 | audit §1 D-017 |
| Logged-in top-bar (N-03) | `/feed`, `/calendar`, `/networking`, `/media` | `app` | — | ✅ | ✅ | ✅ | — | — | client | In progress | 03 | audit §1 D-009 |
| Avatar dropdown (N-04) — Common | `/profile`, `/dashboard` | `app` | — | ✅ | ✅ | ✅ | ✅ | ✅ | client | In progress | 03 | audit D-015 (duplicate Dashboard) |
| Avatar dropdown (N-04) — Role-specific | `/dashboard/client`, `/projects/mine`, `/finance/spending`, `/explore/people`, `/orders`, `/calendar` | `dashboard`/`app` | — | ✅ | — | — | — | — | client | In progress | 03 | audit §2 |
| Avatar dropdown (N-04) — Role-specific | `/dashboard/professional`, `/gigs/mine`, `/services/mine`, `/orders`, `/finance/payouts`, `/creation-studio`, `/settings/availability` | `dashboard`/`app` | — | — | ✅ | — | — | — | client | In progress | 03 | audit §2 |
| Avatar dropdown (N-04) — Role-specific | `/enterprise`, `/enterprise/team`, `/hire`, `/enterprise/procurement`, `/finance/billing`, `/enterprise/settings` | `dashboard` | — | — | — | ✅ | — | — | client | In progress | 03 | audit §2 |
| Avatar dropdown (N-04) — Admin link | `/internal/admin` (gated by `auth.hasRole('admin')`) | `internal-admin` | — | — | — | — | ✅ | ✅ | **server (must)** | In progress | 03 | audit B-019 B-025 |
| Quick-create (N-06) | `/post/compose`, `/jobs/create`, `/gigs/create`, `/services/create`, `/projects/create`, `/podcasts/create`, `/webinars/create`, `/networking/create`, `/ads/create` | `app` | — | ✅ | ✅ | ✅ | — | — | client | In progress | 03 | audit D-008 (admin paths must be removed) |
| Dashboard sidebar (N-08) | 31 `/dashboard/*` paths | `dashboard` | — | ✅ | ✅ | ✅ | — | — | client | In progress | 03 | audit D-010 (5 paths to verify against atlas) |
| Navigation rail (N-09) — CORE | `/feed`, `/dashboard`, `/inbox`, `/calendar` | `app` | — | ✅ | ✅ | ✅ | — | — | client | In progress | 03 | audit §1 |
| Navigation rail (N-09) — User Discover | `/explore`, `/services`, `/jobs`, `/gigs` | `app` | — | ✅ | — | — | — | — | client | In progress | 03 | audit §1 |
| Navigation rail (N-09) — User Hiring | `/projects/create`, `/jobs/create`, `/dashboard/proposals`, `/projects`, `/dashboard/shortlist` | `dashboard`/`app` | — | ✅ | — | — | — | — | client | In progress | 03 | audit §1 |
| Navigation rail (N-09) — Pro Work | `/jobs`, `/gigs`, `/services`, `/projects`, `/orders`, `/candidate/availability` | `app` | — | — | ✅ | — | — | — | client | In progress | 03 | audit §1 |
| Navigation rail (N-09) — admin block (BAD) | `/admin`, `/admin/finance`, `/admin/moderation`, `/admin/support`, `/admin/trust-safety`, `/admin/users`, `/admin/verification` | `app` (wrong shell) | — | — | — | — | — | — | client | **Needs removal** | 03 | audit D-001, B-017 |
| Mobile bottom (N-10) | `/feed`, `/inbox`, `/create/post`, `/jobs`, `/profile` | `app` | — | ✅ | ✅ | ✅ | — | — | client | In progress | 03 | audit D-007, B-022 (no Dashboard slot) |
| Mobile dashboard (N-11) | 20 `/dashboard/*` paths | `dashboard` | — | ✅ | ✅ | ✅ | — | — | client | In progress | 03 | audit D-011 (16 dashboard routes not in mobile) |
| Admin shell (N-18) — `/admin/*` (BAD) | `/admin`, `/admin/ads-ops`, `/admin/audit`, `/admin/cs`, `/admin/dispute-ops`, `/admin/finance`, `/admin/marketing`, `/admin/moderation`, `/admin/ops`, `/admin/search`, `/admin/super`, `/admin/super/emergency`, `/admin/super/flags`, `/admin/trust-safety`, `/admin/verification-compliance` | `internal-admin` (wrong path prefix) | — | — | — | — | — | — | client | **Needs migration to /internal/\*** | 03 | audit D-002, B-018 |
| Admin shell (N-18) — canonical (target) | `/internal/admin`, `/internal/finance-admin-dashboard`, `/internal/moderator-dashboard`, `/internal/super-admin-command-center`, `/internal/trust-safety-ml-dashboard`, `/internal/verification-compliance-dashboard`, `/internal/dispute-operations-dashboard`, `/internal/customer-service`, `/internal/ads-ops-dashboard`, `/internal-chat`, `/customer-chat`, `/kpi-cards`, `/notices`, `/website-settings`, `/trust` | `internal-admin` | — | — | — | — | ✅ | ✅ | **server (must)** | In progress | 03 | audit §2 §4, B-018 B-028 |
| Footer (N-19) | `/`, `/privacy`, `/terms`, `/trust-safety` (incomplete) | `public`+`app` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | n/a | **Incomplete** | 03 | audit D-006, B-021 (missing 11 routes) |