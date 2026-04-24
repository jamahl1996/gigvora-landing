# Gigvora Release-Readiness Programme

This directory is the **single source of truth** for the 40-phase Loveable
release-readiness programme. Every phase MUST update the relevant tracker(s)
and record evidence here before being marked complete.

## Folder layout

```
docs/release-readiness/
├── README.md                   ← you are here
├── GOVERNANCE.md               ← phase rules, evidence standards, exit gates
├── PHASE_LOG.md                ← chronological log of every phase pass
├── BLOCKERS.md                 ← unresolved blockers register
├── audits/
│   └── 01-route-baseline.md    ← initial repo baseline (Phase 1)
├── evidence/                   ← screenshots, playwright traces, SQL output
└── trackers/
    ├── 01-route-atlas.md
    ├── 02-role-access-matrix.md
    ├── 03-page-component-inventory.md
    ├── 04-button-cta-wiring.md
    ├── 05-form-field-validation.md
    ├── 06-supabase-schema-rls.md
    ├── 07-edge-functions-cron.md
    ├── 08-storage-buckets.md
    ├── 09-realtime-presence.md
    ├── 10-search-indexing.md
    ├── 11-payments-billing.md
    ├── 12-webrtc-media.md
    ├── 13-admin-portal.md
    ├── 14-security-compliance.md
    └── 15-qa-launch-gate.md
```

## Status vocabulary

Every tracker row uses the same four-state status:

| Status        | Meaning                                                       |
|---------------|---------------------------------------------------------------|
| `Not started` | No work attempted yet                                         |
| `In progress` | Code/migration/test underway, not yet evidenced               |
| `Verified`    | Evidence captured (screenshot / SQL / Playwright) and linked  |
| `Complete`    | Verified + signed off in PHASE_LOG.md                         |

## Evidence rules

- Every `Verified`/`Complete` row must link to a file under `evidence/`.
- Evidence file naming: `evidence/phase-NN/<tracker>-<short-slug>.<ext>`.
- Schema changes link to the migration file under `supabase/migrations/`.
- Playwright runs link to the spec under `tests/playwright/`.

## Loveable paste rule

Phases are pasted into Loveable **one at a time**. Each pass MUST end by:

1. Updating every tracker row it touched.
2. Appending an entry to `PHASE_LOG.md`.
3. Adding any deferred item to `BLOCKERS.md`.

No phase may be marked complete without those three steps.