# Phase 02 — Canonical Route Atlas, Shell Ownership, Orphans & Collisions

Captured: 2026-04-23. Source of truth: `src/App.tsx` (legacy SPA route table).

## Headline numbers

| Metric | Value |
|--------|-------|
| Total `<Route path=...>` declarations in `App.tsx` | **635** |
| Distinct path strings | **630** |
| Real path collisions (excluding the global `*` catch-all) | **4** |
| Distinct top-level domain prefixes | **122** |
| Shell wrappers in use | **5** (`PublicShell`, `LoggedInShell`, `DashboardShell`, `AIShell`, `InternalAdminShell`) |
| Splat / wildcard routes (`/*`) | **24** (`/ads/*`, `/services/*`, … see §5) |

## 1. Shell registry

Every route in the legacy table sits under exactly one of these five shells.
The canonical assignment for the rebuild is below — Phase 02 LOCKS this map;
later phases may add sub-shells but MUST NOT introduce a 6th top-level shell
without re-opening this audit.

| Shell ID            | Component (current)         | Future TSR layout file        | Auth | Purpose                                                              |
|---------------------|-----------------------------|-------------------------------|------|----------------------------------------------------------------------|
| `public`            | `PublicShell`               | `src/routes/_public.tsx`      | none | Marketing, showcase, pricing, legal, status, auth pages              |
| `app`               | `LoggedInShell`             | `src/routes/_app.tsx`         | user | Day-to-day product surface (feed, network, profile, marketplace, …) |
| `dashboard`         | `DashboardShell`            | `src/routes/_dashboard.tsx`   | user | 3-column command centers (work, hire, ads, finance, …)               |
| `ai`                | `AIShell`                   | `src/routes/_ai.tsx`          | user | Gigvora AI workspace suite (chat, writing, image/video, BYOK)        |
| `internal-admin`    | `InternalAdminShell`        | `src/routes/_internal.tsx`    | admin| Internal admin terminal — strictly isolated from public surfaces     |

Rule: **a route belongs to exactly one shell**. Routes that currently render
inside two shells (the 4 collisions in §3) are flagged below.

## 2. Domain ownership map (top 50 prefixes)

Each prefix is owned by one shell. This is the canonical decision used by
Phase 03+ to mount routed pages.

| Prefix              | Routes | Shell             | Notes                                                  |
|---------------------|-------:|-------------------|--------------------------------------------------------|
| `dashboard`         | 36     | `dashboard`       | role-rooted command centers                             |
| `launchpad`         | 26     | `app`             | Experience Launchpad cohort surfaces                    |
| `ads`               | 24     | `dashboard`       | Ads Manager workstation                                 |
| `projects`          | 22     | `dashboard`       | project workspaces (internal vs client-visible)         |
| `networking`        | 22     | `app`             | Networking Hub (cards, follow-ups)                      |
| `gigs`              | 22     | `app`             | productized marketplace                                 |
| `hire`              | 19     | `dashboard`       | unified recruiter namespace                             |
| `recruiter-pro`     | 18     | `dashboard`       | recruiter-pro features (privacy-contained)              |
| `navigator`         | 18     | `dashboard`       | Sales Navigator                                         |
| `enterprise-connect`| 18     | `dashboard`       | enterprise outreach                                     |
| `internal`          | 17     | `internal-admin`  | admin terminal                                          |
| `ai`                | 17     | `ai`              | AI workspace                                            |
| `webinars`          | 16     | `app`             | live + recorded webinars                                |
| `services`          | 16     | `app`             | consultative services marketplace                       |
| `podcasts`          | 16     | `app`             | podcast monetization                                    |
| `showcase`          | 14     | `public`          | unauthenticated public discovery                        |
| `inbox`             | 14     | `app`             | enterprise inbox + chat                                 |
| `explore`           | 14     | `app`             | discovery surfaces                                      |
| `media`             | 13     | `app`             | reels / video / podcast root                            |
| `jobs`              | 12     | `app`             | jobs board                                              |
| `profile`           | 11     | `app`             | 11-tab profile system                                   |
| `finance`           | 10     | `dashboard` (1) / `internal-admin` (1) | **collision** — see §3 |
| `events`            | 10     | `app`             | events (full-page; no drawer)                           |
| `help`              | 9      | `public`          | help center                                             |
| `groups`            | 9      | `app`             |                                                        |
| `disputes`          | 9      | `dashboard`       |                                                        |
| `recruiter`         | 8      | `dashboard`       | being absorbed into `/hire/*` (B-008-related)           |
| `creation-studio`   | 7      | `app`             | block editor + wizards                                  |
| `mentorship`        | 6      | `app`             |                                                        |
| `legal`             | 6      | `public`          | terms, privacy, agreements                              |
| `org`               | 5      | `dashboard`       | org admin                                               |
| `escrow`            | 5      | `dashboard`       | finance subset                                          |
| `contracts`         | 5      | `dashboard`       |                                                        |
| `calendar`          | 5      | `app`             |                                                        |
| `tickets`           | 4      | `dashboard`       |                                                        |
| `tasks`             | 4      | `dashboard`       | feeds Work Hub aggregation                              |
| `notifications`     | 4      | `app`             |                                                        |
| `notices`           | 4      | `internal-admin`  |                                                        |
| `emails`            | 4      | `dashboard`       |                                                        |
| `analytics`         | 4      | `dashboard`       |                                                        |
| `trust`             | 3      | `internal-admin`  |                                                        |
| `settings`          | 3      | `app`             |                                                        |
| `kpi-cards`         | 3      | `internal-admin`  |                                                        |
| `internal-chat`     | 3      | `internal-admin`  |                                                        |
| `enterprise`        | 3      | `dashboard`       |                                                        |
| `customer-chat`     | 3      | `internal-admin`  |                                                        |
| `website-settings`  | 2      | `internal-admin`  |                                                        |
| `volunteering`      | 2      | `app`             |                                                        |
| `sales-navigator`   | 2      | `dashboard`       | alias of `/navigator` — see §4                          |
| `companies`         | 2      | `app`             |                                                        |
| `candidate`         | 2      | `app`             |                                                        |

The remaining ~70 single-route prefixes are each owned by the shell of their
nearest sibling and listed in `trackers/01-route-atlas.md`.

## 3. Path collisions (real bugs — must fix in Phase 03)

Four path strings are declared twice, each binding to a different component.
React Router resolves to the **last** matching `<Route>`, so the earlier
declarations are effectively dead code today.

| # | Path                  | Declaration A (line) | Declaration B (line) | Resolution                                                                                         |
|---|-----------------------|----------------------|----------------------|----------------------------------------------------------------------------------------------------|
| C-1 | `/services/orders`   | `ServiceOrdersPage` (803) | `ServiceOrdersCenterPage` (1249) | KEEP `ServiceOrdersCenterPage` (newer "Center" surface). Delete A. Add to atlas as canonical.      |
| C-2 | `/services/analytics`| `ServicesMarketplacePage` (805) | `ServiceAnalyticsPage` (1251) | KEEP `ServiceAnalyticsPage`. The earlier line was a placeholder pointing at the marketplace shell. |
| C-3 | `finance` (admin)    | `FinanceAdminPage` (1013) | `FinanceLandingPage` (1053) | KEEP `FinanceLandingPage`. Move ops surface to `/internal/admin/ops/finance` under §AD-019.        |
| C-4 | `moderation` (admin) | `AdminOpsPage` (1011) | `ModerationLandingPage` (1073) | KEEP `ModerationLandingPage`. Move ops surface to `/internal/admin/ops/moderation` under §AD-020.  |

All four are added to `BLOCKERS.md` as **B-011 … B-014** and referenced from
the route atlas tracker. Phase 03 must close them before any new routed
admin or marketplace work begins.

## 4. Aliases (intentional duplicates that point to one canonical)

Pre-launch policy: keep aliases ONLY where there is a documented marketing or
SEO reason. Otherwise, redirect alias → canonical.

| Alias path           | Canonical path     | Action       | Reason                              |
|----------------------|--------------------|--------------|-------------------------------------|
| `/sales-navigator/*` | `/navigator/*`     | 301 redirect | Recruitment unification (mem)       |
| `/recruiter/*`       | `/hire/*`          | 301 redirect | `mem://features/recruitment-unification` |
| `/admins`            | `/internal/admin`  | 301 redirect | Singular canonical                  |
| `/agencies/:slug`    | `/agency/:slug`    | 301 redirect | Plural alias on public showcase     |
| `/signin`            | `/auth?mode=signin`| 301 redirect | Single auth surface                 |
| `/signup`            | `/auth?mode=signup`| 301 redirect | Single auth surface                 |
| `/services/mine`     | `/services?owner=me`| 301 redirect | Filter param, not separate route   |

Wildcard catch-alls (`/ads/*`, `/services/*`, `/internal/*`, …) are NOT
aliases — they are fallback handlers and are listed in §5.

## 5. Splat / catch-all routes (24)

Each one renders a domain-specific NotFound or shell index. Phase 03 will
replace these with explicit `notFoundComponent` per route group when
migrating to TanStack Start.

`/ads/*`, `/ai/*`, `/calendar/*`, `/creation-studio/*`, `/dashboard/*`,
`/disputes/*`, `/enterprise-connect/*`, `/gigs/*`, `/hire/*`,
`/internal/*`, `/jobs/*`, `/launchpad/*`, `/learn/*`, `/media/*`,
`/mentorship/*`, `/navigator/*`, `/networking/*`, `/podcasts/*`,
`/projects/*`, `/recruiter-pro/*`, `/recruiter/*`, `/services/*`,
`/showcase/*`, `/webinars/*`.

## 6. Orphan routes

Routes whose component file exists but whose path is not reachable from any
menu, top-bar, or in-page link. Identified by: route declared in `App.tsx`,
but the path string does not appear anywhere else in `src/`.

Phase 02 ships the **method**; the exhaustive orphan list is built per-domain
during the corresponding domain phase (e.g., orphan ads routes are catalogued
in the Ads phase). The detection command is:

```bash
# for path P, count non-App.tsx mentions
grep -r --include="*.tsx" --include="*.ts" -lF "$P" src \
  | grep -v "src/App.tsx" | wc -l
```

An "orphan" is any route whose count is `0`. Each domain phase MUST run this
pass for its prefix and add a row to the route atlas with
`Status = orphan`.

## 7. Pages vs drawers — placement policy

Per `mem://style/navigation-standards`, the bias is **routed full pages**
over drawers. Drawers are permitted only when ALL three are true:

1. The interaction is a **side-by-side comparison** of two records, OR
2. The interaction is **transient** (≤ 30 s, no deep linking ever needed), OR
3. The interaction is a **picker** invoked from inside another form.

For Phase 03+, the following surfaces are LOCKED as full pages (drawer
rebuilds are forbidden): events, jobs, gigs, services, projects, contracts,
disputes, profile tabs, hire candidate detail, ads campaign detail, finance
admin ops, moderation admin ops, internal-admin terminals.

The following surfaces are LOCKED as drawers/inspectors: QuickPreviewDrawer
(card hover), DetailInspector (table-row peek), CompareDrawer (≤ 3 records),
EntityHoverCard, PlanUpgradeDrawer, BookingPicker (inside a form).

## 8. Reproduction commands

```bash
grep -oE 'path="[^"]+"' src/App.tsx | sort -u | wc -l                # 630 distinct
grep -oE 'path="[^"]+"' src/App.tsx | sort | uniq -d                 # 5 duplicates
grep -oE 'element=\{<[A-Z][a-zA-Z]+(Shell|Layout)' src/App.tsx \
  | sort | uniq -c                                                   # shells
awk -F/ 'NF>=2 && $2!="" {print $2}' /tmp/routes_clean.txt \
  | sort | uniq -c | sort -rn                                        # domain hist
```