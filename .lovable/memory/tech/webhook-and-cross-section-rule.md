---
name: Webhook + Cross-Section Rule
description: Every domain pack must wire outbound webhooks + cross-domain bus links + a third-party adapter map. Mandatory for D24+ and back-applied as backfills are sweeped.
type: preference
---
**Rule:** Every backend domain pack MUST ship:
1. An `*.emit.ts` (or `dN-emissions.ts`) helper publishing one outbound webhook per meaningful state transition AND emitting onto the cross-domain bus (`domainBus.emit`).
2. New events appended to the `WebhookEvent` union in `apps/api-nest/src/modules/outbound-webhooks/outbound-webhooks.publisher.ts`.
3. A `DNAdapters` const declaring the third-party integration surface (storage, av-scanning, search, email, sms-push, crm, payments, calendar, voice/video, ats-handoff, analytics, webhooks).
4. SDK subpath in `packages/sdk/package.json` + matching path entry in `tsconfig.app.json` (`@gigvora/sdk/*`).
5. Module registration in `apps/api-nest/src/app.module.ts`.

**Why:** Outbound webhook publishers (HMAC signing, delivery logs, retry/DLQ, replay) are the only contract enterprise tenants can rely on. Per-domain adapter maps are required by mem://tech/third-party-integration-rule. SDK subpath wiring is what lets the web + Flutter clients consume domain types without a build break.

**How to apply:** When backfilling D1–D23 or shipping new domains, complete all five items in the same sweep. Reference D32 (`apps/api-nest/src/modules/projects-browse-discovery/`) as the canonical template.
