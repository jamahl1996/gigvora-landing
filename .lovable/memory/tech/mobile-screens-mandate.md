---
name: Mobile Screens Mandate
description: Every domain ships complete Flutter screens (not just an API client) with Riverpod, router entries, and full UI states
type: preference
---
**Rule:** A domain is incomplete if mobile only ships an `*_api.dart` client.

**Per domain, Flutter must include:**
- `apps/mobile-flutter/lib/features/<domain>/<domain>_api.dart` — typed Dio client.
- `apps/mobile-flutter/lib/features/<domain>/<domain>_providers.dart` — Riverpod providers (repository + async notifiers) wrapping the API.
- **Screens** (minimum set, adapted per domain):
  - `<Domain>ListScreen` — list/discovery with pull-to-refresh, infinite scroll, empty/error/loading states, search/filter sheet.
  - `<Domain>DetailScreen` — full detail with tabs/segmented control where the web has tabs.
  - `<Domain>ComposeScreen` (or bottom sheet) — create/edit form with validation, optimistic UI, retry on failure.
  - Action sheets for destructive/admin actions (archive, remove member, change role) with confirm dialog.
- **Routing** — register routes in `apps/mobile-flutter/lib/app/router.dart` with deep links matching web URL family (e.g. `/companies`, `/companies/:slug`, `/companies/:id/edit`).
- **State** — every screen handles `loading`, `empty`, `error (with retry)`, `success`, `stale (refreshing)` explicitly.
- **A11y + i18n hooks** — semantics labels on actionable widgets; user-facing strings centralised for future localisation.
- **Auth + token** — uses `apiClientProvider` Dio with bearer interceptor; surfaces 401 by routing to sign-in.
- **Offline / retry** — GET screens cache last response in memory; mutations show snackbar with retry on failure.

**Test marker:** the domain doc must list the mobile screen files under a "Mobile screens" section. If the section is missing, the domain is not done.
