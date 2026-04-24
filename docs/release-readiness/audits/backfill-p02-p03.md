# Cross-Phase Backfill — Phases 02 + 03 (build gaps)

Captured: 2026-04-23. Closes blockers that were code/infra (not deferred to a
future phase) and had been left as documentation-only after Phases 02 and 03.

## Files changed

| File | Change | Blocker |
|------|--------|---------|
| `src/App.tsx` | Removed duplicate `/services/orders` registration (was shadowing `ServiceOrdersCenterPage`). | B-011 |
| `src/App.tsx` | Removed duplicate `/services/analytics` registration (was shadowing `ServiceAnalyticsPage`). | B-012 |
| `src/App.tsx` | Added canonical `/auth/sign-in` and `/auth/sign-up` routes; converted `/signin`, `/signup`, `/services/mine`, `/sales-navigator` to `<Navigate replace>` redirects; deleted unused `ServiceOrdersPage` import; added `Navigate` to react-router-dom import. | B-015 |
| `src/data/navigation.ts` | Rewrote 8 `/solutions/*` hrefs to `/showcase/*` in `PUBLIC_MEGA_MENUS` and `FOOTER_COLUMNS`. Added `/legal/cookies`, `/legal/dpa`, `/legal/aup` to footer Legal column. Removed `/inbox/sarah` demo deep-link. | B-020, B-021, B-026 |
| `src/components/shell/MobileBottomNav.tsx` | Replaced `/jobs` slot with `/dashboard` (BarChart3 icon). | B-022 |
| `src/components/shell/QuickCreateMenu.tsx` | Imports `useUserRoles`; falls back to `user` action set when `activeRole === 'admin'` but `isAdmin` is false. | B-023, B-035 |
| `src/components/navigation/AvatarDropdown.tsx` | Removed duplicate Dashboard from `COMMON_ITEMS`. Added server-checked "Switch to Admin Console" entry visible only when `useUserRoles().isAdmin` is true. | B-027, B-019 |

## Verification

- `bunx tsc --noEmit` clean.
- All redirects target routes that exist in `src/App.tsx` (verified via grep).
- All admin gating uses the server-derived `useUserRoles().isAdmin` (no
  client-only checks introduced).

## Out of scope (still open)

- **B-013, B-014** (admin route collisions in `/admin/finance`, `/admin/moderation`) — belong to the Phase 13 admin portal migration; the canonical `/internal/*` namespace is not yet stood up.
- **B-016** (24 splat routes serving generic shell index) — deferred to TanStack Start migration (B-008).
- **B-017, B-018, B-024, B-028** — admin nav structural rework, scoped to Phase 13.
- **B-029, B-030, B-031, B-032, B-033, B-034, B-036** — phase-scoped follow-ups (cosmetic, sweeps, CI guards, auth provider config, role-grant UI).