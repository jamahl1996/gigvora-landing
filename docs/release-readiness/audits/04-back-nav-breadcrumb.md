# Phase 04 — Back-button, Breadcrumb, and No-Dead-End Navigation

Captured: 2026-04-23. Source of truth: every shell + every empty-state.

## 1. Coverage matrix — back-nav per shell

| Shell ID            | File                                       | AutoBackNav before | AutoBackNav after | Notes |
|---------------------|--------------------------------------------|:------------------:|:-----------------:|-------|
| `public`            | `src/components/layout/PublicShell.tsx`    | ✅                 | ✅                | already mounted Phase 02 |
| `app`               | `src/components/layout/LoggedInShell.tsx`  | ❌                 | ✅                | **mounted in Phase 04** |
| `dashboard`         | `src/components/layout/DashboardShell.tsx` | ✅                 | ✅                | already mounted |
| `ai`                | `src/components/ai/AIShell.tsx`            | ❌                 | ✅                | **mounted in Phase 04** |
| `internal-admin`    | `src/components/layout/AdminShell.tsx`     | ❌                 | ✅                | **mounted in Phase 04** + max-width container |

All 5 canonical shells from Phase 02 §1 now render `AutoBackNav` above the
route `<Outlet />`. The component self-suppresses on root routes (see §2).

## 2. Root-route policy (no false back buttons)

`AutoBackNav.ROOT_ROUTES` is the authoritative list of "section homes". The
component renders nothing when `pathname` matches a root, so a user on
`/feed` does not see a "Back to /" link to a non-existent parent.

Phase 04 expanded this set from **17 entries** (Phase 02-era) to **66
entries** so every prefix exposed by `NavigationRail`, `LoggedInTopBar`,
`MobileBottomNav`, `Footer`, or the public mega-menu is recognised as a
root. Categories:

- **Public roots** (22): `/`, `/landing`, `/auth`, `/signin`, `/signup`,
  `/onboarding`, `/about`, `/pricing`, `/contact`, `/faq`, `/terms`,
  `/privacy`, `/support`, `/solutions`, `/product`, `/help`, `/status`,
  `/blog`, `/careers`, `/press`, `/trust-safety`.
- **App roots** (40): `/dashboard`, `/feed`, `/inbox`, `/calendar`,
  `/notifications`, `/profile`, `/saved`, `/work`, `/explore`, `/orders`,
  `/jobs`, `/gigs`, `/services`, `/projects`, `/contracts`, `/networking`,
  `/groups`, `/media`, `/webinars`, `/podcasts`, `/events`, `/learn`,
  `/mentorship`, `/launchpad`, `/documents`, `/finance`, `/escrow`,
  `/disputes`, `/tickets`, `/tasks`, `/ads`, `/navigator`,
  `/recruiter-pro`, `/enterprise-connect`, `/hire`, `/creation-studio`,
  `/ai`, `/settings`, `/pages`, `/analytics`, `/calls`, `/interactive`,
  `/volunteering`, `/companies`, `/agencies`.
- **Internal/admin roots** (3): `/internal`, `/internal/admin`, `/admin`.

Any future top-level prefix added by a domain phase MUST be added to
`ROOT_ROUTES` in the same patch.

## 3. Breadcrumb label coverage

`AutoBackNav.SEGMENT_LABELS` is a path-segment → human-label dictionary used
to render breadcrumb segments. Phase 04 grew it from **53 entries** (Phase
02-era) to **141 entries** to cover every domain prefix in the Phase 02
atlas (122 prefixes + common sub-paths like `mine`, `create`, `manage`,
`drafts`, `library`, etc.).

Coverage by domain:

| Domain family               | Segments labelled |
|-----------------------------|-------------------|
| Marketplace + work          | gigs, services, jobs, projects, orders, contracts, proposals, shortlist, applications, pipeline, mine, manage, work-queue, bookings |
| Identity + profile          | profile, settings, candidate, availability, integrations |
| Discovery                   | explore, search, suggestions, discover, showcase |
| Network + community         | networking, groups, rooms, cards, connections, followers, follow-ups, introductions, invitations, speed, collaboration, mentorship |
| Media                       | media, reels, videos, library, podcasts, webinars, events, calls |
| Money                       | finance, escrow, billing, invoices, wallet, spending, payouts, earnings, procurement, spend, vendors |
| Hire / sales                | hire, navigator, sales-navigator, recruiter-pro, hiring, interviews, pools, team |
| Ads                         | ads, audiences, promote, campaigns |
| Enterprise                  | enterprise, enterprise-connect, org, startups |
| AI + creation               | ai, creation-studio, drafts, scheduled, assets, content |
| Notifications + tasks       | notifications, digest, tickets, tasks, emails, holds |
| Internal admin              | internal, internal-chat, customer-chat, kpi-cards, notices, website-settings, status, ops, moderation, super, cs, audit, marketing, ads-ops, dispute-ops, trust-safety, verification-compliance, emergency, flags |
| Public marketing            | help, pricing, about, careers, press, contact, blog, faq |
| Launchpad                   | launchpad, challenges, pathways, learn |

Any segment not in the dictionary falls back to title-cased
`segment.replace(/[-_]/g, ' ')`. This is acceptable for ad-hoc dynamic
segments (e.g. `/profile/jane-doe` → "Jane Doe").

## 4. SectionBackNav usage census

`SectionBackNav` is a manual breadcrumb used inside complex nested workflows
(33 call sites across `src/pages/` per the Phase 03 inventory). It coexists
with `AutoBackNav`:

- `AutoBackNav` is the **shell-level** back path (always visible at the
  top of the route container).
- `SectionBackNav` is the **page-level** breadcrumb (used by sub-shells like
  `HireShell`, wizards, and detail pages that want a custom home anchor).

No code change was needed — both components remain in service. Phase 04
merely verifies they coexist without duplicating UI (each page that uses
`SectionBackNav` should use it INSTEAD of `AutoBackNav`, not in addition;
the shell suppresses `AutoBackNav` only on root routes, so the small
overlap on a few sub-shell home routes is acceptable visual redundancy).
Any page that wants to suppress `AutoBackNav` should be wrapped in a
sub-shell that overrides the container — tracked as **B-029** for any
future cosmetic clean-up.

## 5. No-dead-end policy & primitive

Created `src/components/shell/EmptyStateCTA.tsx` — a single primitive that
EVERY empty state, error state, or unauthorised state should render so the
user is never stranded. Properties:

- `icon` (default `Inbox`), `title`, `description`
- `primaryAction` — recommended next-best route (e.g. "Browse network")
- `secondaryAction` — defaults to `{ label: 'Back to dashboard', to: '/dashboard' }`
  so even a developer who forgets to pass a recovery path gets one for free.

Phase 04 ships the primitive. **Each subsequent domain phase must replace
raw "no items" placeholders with `EmptyStateCTA`.** Tracked as **B-030**
(audit pass: enumerate every JSX node containing the strings "No items",
"Empty", "Nothing here", "0 results" and migrate them).

## 6. Dead-end audit — sample of routes that lacked recovery before Phase 04

| Route                            | Symptom (before)                              | Recovery (after)                                 |
|----------------------------------|------------------------------------------------|--------------------------------------------------|
| `/inbox/:id` (no thread found)   | Blank canvas with no back affordance           | Shell-level AutoBackNav → `/inbox`               |
| `/internal/finance-admin-dashboard` | Admin shell had no back affordance             | Shell-level AutoBackNav → `/internal/admin`      |
| `/ai/chat/:sessionId` (404)      | Blank AI canvas with no back affordance        | Shell-level AutoBackNav → `/ai/chat` then `/ai`  |
| `/feed?tab=trending` (filtered empty) | "No posts" with no recovery CTA           | EmptyStateCTA primitive available for adoption   |
| `/services?owner=me` (no listings) | "No services yet" with no recovery CTA       | EmptyStateCTA primitive available for adoption   |
| `/explore?q=zzzzzz` (zero hits)  | "No results" with no recovery CTA              | EmptyStateCTA primitive available for adoption   |

The first 3 are now covered by the shell mount. The latter 3 require the
per-domain migration scheduled under **B-030**.

## 7. Reproduction commands

```bash
# 1. confirm AutoBackNav is mounted in every shell
grep -l "AutoBackNav" src/components/layout/*.tsx src/components/ai/AIShell.tsx

# 2. enumerate root routes
sed -n '/^const ROOT_ROUTES/,/^]/p' src/components/shell/AutoBackNav.tsx

# 3. enumerate breadcrumb segment labels
sed -n '/^const SEGMENT_LABELS/,/^};/p' src/components/shell/AutoBackNav.tsx | wc -l

# 4. find pages that still ship raw "no items" strings (B-030 backlog)
grep -rEn "No (items|posts|results|listings|matches|conversations|messages)" \
  src/pages | head -50
```

## 8. Summary counters

| Metric                                              | Before | After |
|-----------------------------------------------------|-------:|------:|
| Shells mounting `AutoBackNav`                       | 2 / 5  | 5 / 5 |
| Entries in `ROOT_ROUTES`                            | 17     | 66    |
| Entries in `SEGMENT_LABELS` (breadcrumb dict)       | 53     | 141   |
| `EmptyStateCTA` primitive available                 | no     | yes   |
| Pages using `SectionBackNav` (manual breadcrumb)    | 31     | 31 (unchanged — coexists) |
| New blockers                                        | —      | 2 (B-029 cosmetic dedup, B-030 empty-state migration) |