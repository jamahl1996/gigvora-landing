---
name: Every Implementation Required Pack
description: Every domain (D1+) MUST ship outbound webhooks, adapter map, cross-domain bus wiring, and DomainWebhooksTab in one pack — no partial deliveries.
type: feature
---

Every new or extended domain (D1 onwards) MUST ship the full integration pack
in a single change. Partial deliveries (e.g. service logic without webhooks,
or webhooks without an adapter map) are not allowed.

## Mandatory deliverables per domain

1. **Outbound webhooks** — register every state-transition event in
   `WebhookEvent` (apps/api-nest/src/modules/outbound-webhooks/) and add a
   `DxEmit` helper in `domain-emissions.ts`. Every successful state change in
   the service MUST call its `DxEmit.*` (HMAC-signed, dedupeKey, retry/DLQ,
   replay — handled by `OutboundWebhookPublisher`).
2. **Inbound webhooks** — if the domain accepts provider callbacks, route them
   through `apps/webhook-gateway` (Fastify + BullMQ + Redis dedupe) and never
   directly into the Nest service.
3. **Adapter map** — append the domain to `DOMAIN_ADAPTER_MAP` in
   `apps/integrations/src/domain-adapter-map.ts` declaring `default` (free
   OSS) + `optIn` providers per category (storage / email / sms / calendar /
   voice / ai / crm / ats / payments / analytics). Honour
   `mem://tech/third-party-integration-rule` defaults (Jitsi, local-first
   storage, smtp, lovable-ai, gigvora-credits, analytics-python).
4. **Cross-domain bus wiring** — declare every consumer link in
   `CROSS_DOMAIN_CATALOG` (apps/api-nest/src/modules/domain-bus/domain-bus.ts)
   and wire the handler in `cross-domain-wiring.ts`. The bus carries the hop
   counter — never bypass it with direct service-to-service calls.
5. **Frontend Webhooks tab** — every domain workbench MUST mount the shared
   `DomainWebhooksTab` (subscriptions + delivery log + replay button).
6. **Cross-section connections in UI** — surface adjacency via
   `useCrossDomainContext` so users can navigate from one domain entity to
   the linked entities (e.g. application → requisition → pipeline card →
   interview → scorecard).

## Backfill rule

Existing domains that pre-date this rule MUST be backfilled in groups of 6
(D1–6, D7–12, D13–18, D19–24) before any new feature is added in those
domains. The legacy D24–D29 pack has been renumbered to D25–D30; helpers
expose legacy aliases so old imports keep compiling.

## Hard checklist (block PR if any item missing)

- [ ] `WebhookEvent` extended with all new events
- [ ] `DxEmit` helper added and called on every state transition
- [ ] `DOMAIN_ADAPTER_MAP[Dx]` declared with required defaults
- [ ] `CROSS_DOMAIN_CATALOG` updated with every consumer link
- [ ] `cross-domain-wiring.ts` subscribes the consumer handlers
- [ ] Domain workbench renders `DomainWebhooksTab`
- [ ] Adjacency hook (`useCrossDomainContext`) wired into entity detail view
