---
name: Outbound Webhooks Rule
description: Every domain pack MUST publish state-change events as outbound webhooks via the shared OutboundWebhookPublisher (HMAC-SHA256 signed, dedupe key, retry+DLQ, replay endpoint).
type: feature
---

Every Domain pack (24+) MUST emit outbound webhooks for **every** state
transition it already publishes via Socket.IO. Realtime is for in-app UX;
outbound webhooks are for tenant integrations, BI pipelines, and third-party
automation. Both are required — never one without the other.

## Mandatory wiring per domain
1. Inject `OutboundWebhookPublisher` (from
   `apps/api-nest/src/modules/outbound-webhooks/`) into the domain service.
2. After every successful state transition, call:
   `publisher.publish({ tenantId, event, entityType, entityId, payload, dedupeKey })`
3. Event names mirror Socket.IO topics 1:1 (e.g. `interview.transitioned`,
   `card.moved`, `prospect.status.changed`, `outreach.sent`,
   `application.submitted`, `requisition.approved`, `posting.published`).
4. Register the domain's events in `OutboundWebhookCatalog` so tenants can
   subscribe via the API (`POST /webhook-subscriptions`).

## Hard requirements (non-negotiable)
- **HMAC-SHA256** signature header `X-Gigvora-Signature: t=<ts>,v1=<sig>`
  computed over `${ts}.${rawBody}`; rotating secret per subscription.
- **Idempotency** via `dedupeKey` (Redis SETNX, 24h TTL); duplicates dropped
  at publisher level.
- **Delivery log** row per attempt: status, http code, latency, attempt #,
  next retry. Visible to tenants via `GET /webhook-deliveries`.
- **Retry policy:** exponential backoff (1m, 5m, 30m, 2h, 12h) → DLQ after 5
  failed attempts. DLQ is replayable via `POST /webhook-deliveries/:id/replay`.
- **SDK verifier:** `packages/sdk/src/webhooks.ts → verifySignature()` exposed
  for consumers; ±5min clock skew tolerance.
- **No PII in headers**, payloads honour the same privacy scope as the
  in-app envelope (recruiting objects stay recruiter-scoped).

## Frontend obligation
Every domain workbench MUST surface a "Webhooks" tab (subscriptions list +
recent deliveries + replay button) — wired via the shared
`useWebhookSubscriptions` / `useWebhookDeliveries` hooks. Do not build a
bespoke webhooks UI per domain.
