---
name: Mobile (Flutter) integrations must be complete and enterprise grade
description: Every domain must ship a complete Flutter feature pack — API client, Riverpod providers, list/detail/edit screens with loading/empty/error/retry, route registration, and an enterprise-grade UI (Material 3, theming, gestures, offline-aware).
type: preference
---

**Rule:** A domain is not done until its Flutter surface is at parity with
the web. That means under `apps/mobile-flutter/lib/features/<domain>/`:

1. **`<domain>_api.dart`** — typed envelope client using `apiClientProvider`,
   with retry + timeout + structured error mapping.
2. **`<domain>_providers.dart`** — Riverpod `FutureProvider.family` per
   read endpoint and `AsyncNotifierProvider` per mutation.
3. **`<domain>_screens.dart`** — at minimum: list screen, detail screen,
   and create/edit screen. Each renders all four journey states (loading
   shimmer, empty CTA, error with retry, populated).
4. **Route registration** in `apps/mobile-flutter/lib/app/router.dart`
   for `/` , `/:id`, and `/:id/edit` as applicable.
5. **Enterprise-grade UI:**
   - Material 3 with the project theme tokens (no hard-coded colors).
   - Pull-to-refresh on every list.
   - Swipe gestures where the action is destructive (with undo SnackBar).
   - Skeleton/shimmer loaders, never bare `CircularProgressIndicator`
     as the only loading state on a primary screen.
   - Offline-aware — gracefully shows cached data when the API is down.
   - Accessibility: semantic labels, 44pt tap targets, dynamic type.

**Back-fill obligation:** When this rule is added, every previously-shipped
domain must be revisited. Any domain missing a Flutter feature pack, route
registration, or enterprise-grade UI must be brought to this bar.

**Why:** Mobile parity is a contractual part of "enterprise production
grade". Shipping a domain without the Flutter pack creates a permanent gap
between web and mobile that compounds across releases.
