---
name: Domain Adapter Map Rule
description: Every domain pack MUST declare an explicit AdapterMap (calendar/email/SMS/ATS/CRM/storage/voice/AI) registered with apps/integrations, with healthchecks, BYOK secrets, and free-OSS defaults.
type: feature
---

Every Domain pack MUST end with an explicit **AdapterMap** describing every
third-party touchpoint it relies on. Provider logic NEVER lives inside the
domain service or React component — it lives in `apps/integrations/src/<category>/`
behind an `Adapter` interface and is resolved by category at runtime.

## Required map (declare even when "none")
| Category   | Default (free/OSS)        | Opt-in providers (BYOK)                |
|------------|---------------------------|----------------------------------------|
| calendar   | ICS file + native invite  | Google Calendar, Microsoft Graph       |
| email      | local SMTP fallback       | Resend, SendGrid, SES                  |
| sms / push | none (no-op + log)        | Twilio, Vonage, FCM, APNs              |
| voice/video| Jitsi Meet (OSS)          | Daily, Zoom, Twilio (forbidden default)|
| storage    | local-first IndexedDB     | S3, R2, GCS                            |
| ats / crm  | none                      | HubSpot, Ashby, Greenhouse, Salesforce |
| ai         | Lovable AI Gateway        | OpenAI, Anthropic, Gemini (BYOK)       |
| analytics  | internal analytics-python | PostHog, Segment                       |

## Hard requirements
1. Each adapter implements `Adapter`: `id`, `category`, `configure(cfg)`,
   `healthcheck()`, plus category-specific verbs
   (`calendar.createEvent`, `email.send`, `ats.upsertCandidate`, …).
2. Register at boot via `register(adapter)` in `apps/integrations/src/index.ts`.
3. Domain services resolve adapters by category:
   `integrations.list('calendar').find(a => a.id === tenant.calendarProvider)`.
4. **Defaults are free/OSS.** Paid SDKs (Twilio, Daily, Zoom, Mux, SendGrid)
   are forbidden defaults — only added on explicit user opt-in via BYOK.
5. **Healthchecks** surfaced in the operator status panel + `/status` page.
6. **Per-tenant credentials** stored encrypted; never in code.
7. The domain's architecture doc MUST contain a "3rd-party + packages" table
   listing every adapter used (or `none`) with the npm packages added.

## Frontend obligation
Every domain workbench MUST link to `/settings/integrations?domain=<id>` for
configuration. No provider strings hardcoded in components.
