---
name: Payment Checkout Pattern
description: Multi-step checkout with explicit summary/review screen, missing-info guard, payment-method picker, success + receipt, and failure-recovery path on every paid surface.
type: feature
---
Every page that takes payment (gig purchases, service bookings, subscription upgrades, event tickets, donations, top-ups, candidate-pool unlocks, AI credits, Recruiter Pro seats, etc.) must implement the full enterprise checkout journey — never a single "Pay" button.

**Required steps (in order):**

1. **Cart / item confirmation** — line items, qty, deliverables, package tier.
2. **Customer details** — billing name, email, address (if needed for invoicing/VAT), VAT/tax number where applicable, save-for-later toggle.
3. **Payment method picker** — card / wallet / saved method / invoice / credits, with provider badges.
4. **Promo / credits / discount input** — apply codes, show recalculated subtotal/tax/total.
5. **Summary / review screen (MANDATORY)** — itemised lines, subtotal, discounts, tax (separated), shipping/fees, total in big type, terms-of-service checkbox, refund policy link, "Edit" link back to each prior step.
6. **Confirm & pay** — disabled until ToS checked and required fields valid; shows spinner + "Do not close window" copy.
7. **Success screen + receipt** — order/ref ID, downloadable receipt/invoice, next-action CTA (start project, join meeting, view subscription), email confirmation note.
8. **Failure / 3DS / retry** — friendly error, retry CTA, change-payment-method CTA, contact support link, never silent failure.

**Cross-cutting requirements:**
- **Missing-info guard** — never let users reach the pay step with incomplete fields; block with inline errors AND a banner listing what's missing.
- **Edit-without-loss** — going back to an earlier step preserves entered data.
- **Refresh persistence** — checkout state survives a page refresh (sessionStorage or server-side draft).
- **Multi-currency** — show user's currency with conversion note where relevant.
- **Audit & receipt** — every successful charge writes to AuditService and emits a receipt to the user's email.
- **Failed-payment recovery** — failed transactions show in `/billing` with a "Complete payment" CTA, not lost.
- **Mobile parity** — checkout uses sticky bottom bar with total + primary CTA; summary expands as a sheet.

When implementing or reviewing any pay flow, verify all eight steps and all cross-cutting requirements exist before closing the task.
