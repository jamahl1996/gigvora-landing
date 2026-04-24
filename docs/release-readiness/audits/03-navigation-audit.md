# Phase 03 — Global Navigation, Menu Placement & Role Binding Audit

Captured: 2026-04-23. Source of truth: every navigation surface in `src/`.

## 1. Navigation surface inventory

Each file is a navigation entry-point that exposes routes to a class of users.
Every Phase ≥ 04 menu change MUST update one of these files (or its data
source) — no ad-hoc nav components.

| # | Surface ID            | File                                                    | Audience            | Data source                              | LOC |
|---|-----------------------|---------------------------------------------------------|---------------------|------------------------------------------|-----|
| N-01 | `public-topbar`    | `src/components/navigation/PublicTopBar.tsx`            | unauth visitors     | `PUBLIC_MEGA_MENUS` (`src/data/navigation.ts:49`)  | 146 |
| N-02 | `public-megamenu`  | `src/components/navigation/MegaMenu.tsx`                | unauth + auth top-bar mega panel | `PUBLIC_MEGA_MENUS` / `LOGGED_IN_MEGA_MENUS` | 226 |
| N-03 | `loggedin-topbar`  | `src/components/navigation/LoggedInTopBar.tsx`          | authed (any role)   | `LOGGED_IN_MEGA_MENUS` (`src/data/navigation.ts:143`) | 230 |
| N-04 | `avatar-dropdown`  | `src/components/navigation/AvatarDropdown.tsx`          | authed (any role)   | `ROLE_MENU_ITEMS` (`src/data/navigation.ts:413`) + inline `COMMON_ITEMS` / `FINANCE_ITEMS` / `FOOTER_ITEMS` | 356 |
| N-05 | `connections-popover` | `src/components/navigation/ConnectionsPopover.tsx`   | authed              | inline                                   |  —  |
| N-06 | `quick-create`     | `src/components/shell/QuickCreateMenu.tsx`              | authed              | inline ( `+` button )                    |  95 |
| N-07 | `dashboard-tabmenu`| `src/components/navigation/DashboardTabMenu.tsx`        | dashboard shell     | inline                                   |  —  |
| N-08 | `dashboard-sidebar`| `src/components/shell/DashboardSidebar.tsx`             | dashboard shell     | inline + `useRole()`                     | 203 |
| N-09 | `nav-rail`         | `src/components/shell/NavigationRail.tsx`               | app shell (left rail) | inline `CORE_NAV` + `ROLE_SECTIONS`    | 275 |
| N-10 | `mobile-bottom`    | `src/components/shell/MobileBottomNav.tsx`              | mobile authed       | inline (5-slot)                          |  76 |
| N-11 | `mobile-dashboard` | `src/components/shell/MobileDashboardNav.tsx`           | mobile dashboard    | inline                                   |  91 |
| N-12 | `network-shell`    | `src/components/shell/NetworkShell.tsx`                 | `/networking/*` sub-shell | inline                              |  —  |
| N-13 | `hire-shell`       | `src/components/shell/HireShell.tsx`                    | `/hire/*` sub-shell | inline                                   |  —  |
| N-14 | `launchpad-shell`  | `src/components/launchpad/LaunchpadShell.tsx`           | `/launchpad/*` sub-shell | inline                              |  —  |
| N-15 | `ai-shell`         | `src/components/ai/AIShell.tsx`                         | `/ai/*` sub-shell   | inline                                   |  —  |
| N-16 | `auth-shell`       | `src/components/auth/AuthShell.tsx`                     | unauth              | inline                                   |  —  |
| N-17 | `legal-shell`      | `src/components/legal/LegalPageShell.tsx`               | unauth              | inline                                   |  —  |
| N-18 | `admin-shell`      | `src/components/layout/AdminShell.tsx`                  | internal admin      | inline `ADMIN_NAV`                        | 394 |
| N-19 | `footer`           | `src/components/navigation/Footer.tsx`                  | unauth + auth       | inline                                   |  99 |

`MegaMenu` (N-02) is a renderer; the data lives in `src/data/navigation.ts`.

## 2. Role × menu placement matrix (canonical)

Roles per `mem://features/user-roles`: **Guest** (unauth), **User**,
**Professional**, **Enterprise**, **Admin** (internal only).

| Surface ↓ / Role →    | Guest | User | Professional | Enterprise | Admin |
|-----------------------|:-----:|:----:|:------------:|:----------:|:-----:|
| N-01 public-topbar    |  ✅   |  —   |      —       |     —      |   —   |
| N-03 loggedin-topbar  |  —    |  ✅  |      ✅      |     ✅     |   —   |
| N-04 avatar-dropdown  |  —    |  ✅  |      ✅      |     ✅     | ✅ (sees admin link only if `hasRole('admin')`) |
| N-06 quick-create     |  —    |  ✅  |      ✅      |     ✅     |   —   |
| N-08 dashboard-sidebar|  —    |  ✅  |      ✅      |     ✅     |   —   |
| N-09 nav-rail         |  —    |  ✅  |      ✅      |     ✅     |   —   |
| N-10 mobile-bottom    |  —    |  ✅  |      ✅      |     ✅     |   —   |
| N-11 mobile-dashboard |  —    |  ✅  |      ✅      |     ✅     |   —   |
| N-18 admin-shell      |  —    |  —   |      —       |     —      |  ✅   |
| N-19 footer           |  ✅   |  ✅  |      ✅      |     ✅     |  ✅   |

**Admin link policy (corrects current code):** the avatar dropdown comment at
`AvatarDropdown.tsx:262` says *"Admin access removed — internal admin uses
separate login portal at /admin/login"*. Per `mem://tech/admin-isolation`
admin is intentionally a distinct portal — the avatar dropdown therefore must
NOT surface an admin link for non-admins, but MAY surface a *Switch to Admin*
entry when `auth.hasRole('admin')` is true. Tracked as **B-019**.

## 3. Findings (D-001 … D-018)

### D-001 — `NavigationRail` references non-canonical `/admin/*` paths
- Severity: **High**
- Location: `src/components/shell/NavigationRail.tsx` (admin section, lines ~150–195)
- Paths: `/admin`, `/admin/finance`, `/admin/moderation`, `/admin/support`,
  `/admin/trust-safety`, `/admin/users`, `/admin/verification`
- Atlas (Phase 02) shows only **2** routes under `/admin/*` (`/admin`,
  `/admin/login`) but **17** under `/internal/*`. The rail is sending users
  to dead URLs that fall through the SPA's catch-all.
- Fix: drop the entire admin block from `NavigationRail`. Admin UX is
  exclusively `N-18 admin-shell` per `mem://tech/admin-isolation`. Tracked
  as **B-017**.

### D-002 — `AdminShell` uses `/admin/*` for internal ops surfaces
- Severity: **High**
- Location: `src/components/layout/AdminShell.tsx` (`ADMIN_NAV`)
- Paths: `/admin`, `/admin/ads-ops`, `/admin/audit`, `/admin/cs`,
  `/admin/dispute-ops`, `/admin/finance`, `/admin/marketing`,
  `/admin/moderation`, `/admin/ops`, `/admin/search`, `/admin/super`,
  `/admin/super/emergency`, `/admin/super/flags`, `/admin/trust-safety`,
  `/admin/verification-compliance`
- Atlas (Phase 02) puts canonical admin under `/internal/...` (e.g.,
  `/internal/finance-admin-dashboard`, `/internal/moderator-dashboard`,
  `/internal/super-admin-command-center`, `/internal/trust-safety-ml-dashboard`).
- Fix: rewrite `ADMIN_NAV` to point at canonical `/internal/*` paths and add
  301 redirects from `/admin/*` (closes B-018 alongside B-013/B-014 from
  Phase 02).

### D-003 — Public mega menu uses `/showcase/*` for Solutions wrong-link
- Severity: Medium
- Location: `src/data/navigation.ts:97-108`
- Paths: `/solutions/clients`, `/solutions/professionals`, `/solutions/creators`,
  `/solutions/enterprise`, `/solutions/recruiters`, `/solutions/agencies`,
  `/solutions/advertisers` — none of these appear in `App.tsx` (the atlas
  has `/showcase/*` as the canonical public-discovery prefix per
  `mem://features/public-showcase-pages`).
- Fix: redirect all `/solutions/<x>` → `/showcase/<x>` OR add the 7 routes.
  Decision: rebrand mega-menu hrefs to `/showcase/<x>` since showcase is the
  established unauth surface; tracked as **B-020**.

### D-004 — `/sales-navigator` alias still surfaced from authed mega menu
- Severity: Medium
- Location: `src/data/navigation.ts` (LOGGED_IN_MEGA_MENUS) — items
  `/sales-navigator`, `/sales-navigator/accounts`, `/sales-navigator/leads`,
  `/sales-navigator/talent`
- Phase 02 §4 marked `/sales-navigator/*` as an alias 301 → `/navigator/*`.
  The mega menu must hit canonical paths so analytics & active-state work.
- Fix: rewrite hrefs to `/navigator/*`. Closes part of **B-015**.

### D-005 — `/services/mine`, `/gigs/mine`, `/projects/mine` are filter aliases
- Severity: Low
- Location: `src/data/navigation.ts` mega menu + `ROLE_MENU_ITEMS`
- Phase 02 §4 ruled `/services/mine` is `/services?owner=me`. Same logic for
  `/gigs/mine` and `/projects/mine`.
- Fix: switch to query-param URLs OR explicitly add the 3 routes. Decision:
  keep `/...mine` as routed shortcuts (they are commonly bookmarked) but
  REMOVE `/services/mine` from B-015's redirect list. **B-015 amended.**

### D-006 — `Footer` exposes only 3 routes
- Severity: Medium
- Location: `src/components/navigation/Footer.tsx`
- Current paths: `/`, `/privacy`, `/terms`, `/trust-safety`
- Missing per `mem://features/system-status-page` and audit §1: `/status`,
  `/help`, `/pricing`, `/about`, `/careers`, `/contact`, `/blog`,
  `/legal/cookies`, `/legal/dpa`, `/legal/aup`, `/sitemap`.
- Fix: rebuild footer in Phase 04 (it is the legal/discovery floor).
  Tracked as **B-021**.

### D-007 — `MobileBottomNav` lacks Dashboard
- Severity: Medium
- Location: `src/components/shell/MobileBottomNav.tsx`
- 5 slots: `/feed`, `/inbox`, `/create/post`, `/jobs`, `/profile`. No path to
  reach Dashboard or Networking from mobile bottom rail. `MobileDashboardNav`
  (N-11) only renders inside `/dashboard/*`, so users on `/feed` cannot
  bridge to dashboard with one tap.
- Fix: replace `/jobs` slot with `/dashboard` for User/Pro roles, add
  `/networking` for Enterprise. Tracked as **B-022**.

### D-008 — `QuickCreateMenu` mixes admin paths into authed `+` button
- Severity: High
- Location: `src/components/shell/QuickCreateMenu.tsx`
- Items pointing at `/admin`, `/admin/audit-logs`, `/admin/trust-safety` are
  visible to any authenticated user. This is a privilege-leak vector — even
  though the destination requires admin role, the UI advertises it.
- Fix: gate items behind `auth.hasRole('admin')` OR remove them entirely
  (they belong in N-18 admin-shell). Tracked as **B-023**.

### D-009 — `LoggedInTopBar` only surfaces 4 hard-links
- Severity: Low
- Location: `src/components/navigation/LoggedInTopBar.tsx`
- Hard `<Link>` targets: `/feed`, `/calendar`, `/networking`, `/media`. All
  other top-bar discovery is via mega-menu hover. Acceptable for desktop, but
  document so Phase 04 keeps the bar terse.

### D-010 — `DashboardSidebar` paths unverified vs atlas
- Severity: Medium
- Location: `src/components/shell/DashboardSidebar.tsx`
- 31 distinct `/dashboard/<x>` paths exposed; atlas has 36 routes under
  `/dashboard`. Five sidebar items must be cross-checked for live mounts.
- Fix: grep for each path in `App.tsx` during Phase 06 (Dashboard refactor).
  Tracked as **B-024**.

### D-011 — `MobileDashboardNav` missing 11 dashboard sub-routes
- Severity: Low
- Location: `src/components/shell/MobileDashboardNav.tsx`
- 20 of 36 dashboard routes exposed on mobile. Acceptable curated subset, but
  document the trimmed list against User/Pro/Enterprise role per
  `mem://tech/mobile-optimization-strategy`.

### D-012 — Avatar dropdown's role switcher UX vs role binding
- Severity: Medium
- Location: `src/components/navigation/AvatarDropdown.tsx:125-145`
- The dropdown lets the user pick `User / Professional / Enterprise` via
  `setActiveRole`. The role thereby drives `ROLE_MENU_ITEMS` rendering and
  `NavigationRail`'s `ROLE_SECTIONS`. There is **no server-side enforcement**
  that the user actually holds the chosen role.
- Fix: gate `setActiveRole(role)` against a `user_roles` table membership.
  This is Phase 18 work (Security hardening); recorded here as **B-025**.

### D-013 — `/feed?tab=...` query-param URLs in mega menu
- Severity: Low
- Location: `src/data/navigation.ts` (LOGGED_IN_MEGA_MENUS feed items)
- `/feed?tab=trending`, `/feed?tab=following`, `/feed?tab=recommended` —
  acceptable; ensures `<Link>` `activeProps` will not fire because query is
  ignored by default. Confirm `activeOptions: { includeSearch: true }` when
  wired in Phase 04.

### D-014 — `/inbox/sarah` hard-coded sample link in mega menu
- Severity: Medium (data hygiene)
- Location: `src/data/navigation.ts` LOGGED_IN_MEGA_MENUS messaging block
- `/inbox/sarah` is demo data leaking into production nav.
- Fix: replace with `/inbox` only OR drive recent-conversations from a query.
  Tracked as **B-026**.

### D-015 — Two `Dashboard` items in avatar dropdown
- Severity: Low
- Location: `AvatarDropdown.tsx` — `COMMON_ITEMS` lists `Dashboard → /dashboard`
  AND each role's first `ROLE_MENU_ITEMS` row is also a Dashboard variant
  (`/dashboard/client`, `/dashboard/professional`, `/enterprise`). Two
  Dashboard rows visible simultaneously is confusing.
- Fix: drop the generic `Dashboard` from `COMMON_ITEMS` when a role-specific
  dashboard exists. Tracked as **B-027**.

### D-016 — Sub-shell rails are mostly empty
- Severity: Low
- Location: `HireShell`, `AIShell` extracted **0** route paths; `NetworkShell`
  exposes 1 (`/networking/rooms`); `LaunchpadShell` exposes 1
  (`/launchpad/discover`).
- These shells render `<Outlet />` but rely on the parent rail for nav.
  Acceptable, but each domain phase must add a context-specific sub-rail.

### D-017 — `PublicTopBar` mixes legacy `/signin` & `/signup`
- Severity: Low
- Location: `src/components/navigation/PublicTopBar.tsx`
- Phase 02 §4 ruled `/signin` & `/signup` redirect to `/auth?mode=…`. The
  top-bar must hit canonical to keep one auth surface.
- Fix: change `Link to="/signin"` → `Link to="/auth" search={{ mode: 'signin' }}`
  during Phase 04. Closes part of **B-015**.

### D-018 — `Footer` shows `/trust-safety` but mega menu shows the same path
- Severity: Low
- Location: footer + `PUBLIC_MEGA_MENUS` Resources/Trust block
- Duplication is acceptable (footer is a discovery floor). No action.

## 4. Orphan-route sweep (per Phase 02 §6 method) — first 10

Routes declared in `App.tsx` but unreachable from any nav surface scanned in
§1. Sample of 10; full per-domain sweep happens during the corresponding
domain phase.

| Route                          | In atlas? | In any nav? | Verdict |
|--------------------------------|:---------:|:-----------:|---------|
| `/notifications/digest`        | ✅        | ❌          | orphan — Phase 09 surfaces in `/notifications` tabs |
| `/disputes/new`                | ✅        | ❌          | orphan — Phase 11 surfaces inside `/disputes` index |
| `/escrow/holds`                | ✅        | ❌          | orphan — Phase 11 surfaces inside `/escrow` index |
| `/internal-chat`               | ✅        | ❌          | orphan — admin-only; Phase 18 surfaces via N-18 |
| `/customer-chat`               | ✅        | ❌          | orphan — admin-only; Phase 18 surfaces via N-18 |
| `/kpi-cards`                   | ✅        | ❌          | orphan — admin-only; Phase 18 surfaces via N-18 |
| `/notices`                     | ✅        | ❌          | orphan — admin-only; Phase 18 surfaces via N-18 |
| `/website-settings`            | ✅        | ❌          | orphan — admin-only; Phase 18 surfaces via N-18 |
| `/trust`                       | ✅        | ❌          | orphan — admin-only; Phase 18 surfaces via N-18 |
| `/launchpad/discover`          | ✅        | ✅ (LaunchpadShell) | reachable |

The 7 admin-only orphans (`internal-chat`, `customer-chat`, `kpi-cards`,
`notices`, `website-settings`, `trust`) are NOT bugs — they intentionally
have no public/app menu entry. They will be exposed only inside
N-18 admin-shell during Phase 18. Tracked as **B-028** (admin-shell
nav must absorb these 7 routes).

## 5. Page-vs-drawer placement re-confirmation

Per Phase 02 §7 the following nav-targeted surfaces are LOCKED as full pages
(no nav surface above may swap them for a drawer): `/events`, `/jobs`, `/gigs`,
`/services`, `/projects`, `/contracts`, `/disputes`, `/profile`,
`/hire/candidates/:id`, `/ads/campaigns/:id`, every `/internal/*` page.

Drawers/inspectors LOCKED as transient overlays (must NOT be promoted to nav
items): `QuickPreviewDrawer`, `DetailInspector`, `CompareDrawer`,
`EntityHoverCard`, `PlanUpgradeDrawer`, booking pickers.

## 6. Reproduction commands

```bash
# 1. enumerate all nav surfaces
find src/components -type f \( -name "*.tsx" \) | \
  xargs grep -liE "Header|Sidebar|Nav|Menu|Footer|Dropdown" | \
  grep -iE "navigation|shell"

# 2. extract routes from a nav file
grep -oE "(to=|href=|path:\s*)['\"\`]/[a-zA-Z0-9/_$:.-]*['\"\`]" "$FILE" \
  | sed -E "s/^(to=|href=|path:\s*)//;s/^['\"\`]//;s/['\"\`]\$//" | sort -u

# 3. check a path is mounted
grep -nE "path=\"$P\"" src/App.tsx

# 4. check a route is reachable from any nav surface
grep -rn -F "$P" src/components/{navigation,shell,layout,launchpad,ai,auth,legal} \
  src/data/navigation.ts
```

## 7. Summary counters

| Metric                                          | Value |
|-------------------------------------------------|-------|
| Distinct nav surfaces                           | **19** |
| New blockers opened by this audit               | **12** (B-017 … B-028) |
| `/admin/*` paths to migrate to `/internal/*`    | **22** (`NavigationRail` + `AdminShell` combined) |
| Alias paths still surfaced from menus           | **9** (sales-navigator ×4, signin, signup, services/mine, …) |
| Footer route deficit                            | 11 missing routes |
| Avatar dropdown duplicate "Dashboard" rows      | 2 |
| Mobile bottom-nav slots                         | 5 (no dashboard bridge) |
| Sub-shells with empty rails                     | 4 (`Hire`, `AI`, `Network`, `Launchpad`) |
| Admin-only orphan routes                        | 7 |