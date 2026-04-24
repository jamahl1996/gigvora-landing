---
name: Cross-Domain Bus Rule
description: Every domain pack MUST publish + subscribe to the shared DomainEventBus so cross-section flows (interview→pipeline, outreach→prospect, application→requisition) stay consistent without point-to-point coupling.
type: feature
---

Domains never call each other's services directly. Cross-section behaviour
flows through the shared **DomainEventBus**
(`apps/api-nest/src/modules/domain-bus/`) which fans events out to:
1. Local in-process subscribers (other domain modules)
2. Socket.IO topics (already mandated by websockets-rule)
3. OutboundWebhookPublisher (already mandated by outbound-webhooks-rule)

## Mandatory wiring
- Each domain registers its **emitted events** in `DomainEventCatalog`
  (`event`, `entityType`, payload schema, downstream consumers).
- Each domain registers its **subscriptions** via
  `bus.subscribe(event, handler)` in its module init.
- Cross-domain handlers are **idempotent** (dedupe key = `event:entityId`).
- Failures retry via BullMQ; persistent failures land in the same DLQ as
  outbound webhooks.

## Required cross-section links (D24–29)
| Source event                       | Consumer domain         | Effect                                  |
|------------------------------------|-------------------------|-----------------------------------------|
| `posting.published` (D24)          | D25 application flow    | Open application channel + ATS sync     |
| `application.submitted` (D25)      | D26 requisition         | +1 applicant counter, anomaly check     |
| `application.submitted` (D25)      | D28 pipeline            | Auto-create card in `sourced` stage     |
| `prospect.status.changed→qualified` (D27) | D28 pipeline    | Auto-create card in `screening` stage   |
| `card.moved→interview` (D28)       | D29 interview planning  | Suggest slots, open scorecards          |
| `interview.completed` (D29)        | D28 pipeline            | Prompt move to `offer` / `rejected`     |
| `scorecard.submitted` (D29)        | D27 prospecting         | Update candidate signal score           |
| `outreach.sent` (D27)              | D25 application flow    | Pre-populate referral source            |

## Frontend obligation
Workbenches MUST surface cross-domain context inline (e.g. interview drawer
shows pipeline stage; pipeline card shows last outreach). No deep-links
without context preview. Use the shared `useCrossDomainContext(entityId)` hook.
