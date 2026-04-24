# Programme Governance

## Global implementation laws

1. Do **not** change the product concept or remove working product families
   without an explicit, documented reason in `PHASE_LOG.md`.
2. Do **not** leave demo data on production pages.
3. Do **not** ship dead buttons, fake toasts, or presentation-only CRUD.
4. Prefer **routed full pages** over right-side drawers unless a drawer is
   genuinely the best interaction (must be justified in the tracker row).
5. No phase is "complete" without an updated tracker row + linked evidence.
6. All security gating MUST be enforced server-side (RLS + edge function
   checks). Client-only gating is treated as a blocker.
7. Every page MUST handle: loading, empty, error+retry, success states.
8. Every form MUST have Zod validation (client) AND server-side validation
   in the corresponding edge function or RLS policy.

## Phase lifecycle

```
 Paste phase  →  Update trackers  →  Implement  →  Capture evidence
      ↓                                                    ↓
   Append PHASE_LOG.md  ←  Mark rows Verified/Complete  ←──┘
      ↓
   Add deferred items to BLOCKERS.md
```

## Exit gates per phase

A phase only exits when **all** of the following are true:

- [ ] All touched routes have a row in `01-route-atlas.md` with status ≥ Verified.
- [ ] All touched buttons/CTAs have a row in `04-button-cta-wiring.md`.
- [ ] All touched forms have a row in `05-form-field-validation.md` with
      Zod schema reference + persistence target.
- [ ] Any new schema/RLS/edge function/storage/realtime change has an
      evidence link (migration path, SQL output, function name).
- [ ] At least one Playwright spec OR a manual browser-validation note
      exists under `evidence/phase-NN/`.
- [ ] `PHASE_LOG.md` updated with date, phase number, summary, blockers.

## Evidence standards

| Type             | Required artefact                                       |
|------------------|---------------------------------------------------------|
| Route            | Screenshot of mounted page + path in route atlas        |
| Button/CTA       | Network log OR Playwright assertion of action firing    |
| Form             | Zod schema file path + successful persistence row       |
| Migration        | Path to `supabase/migrations/*.sql`                     |
| Edge Function    | Function name + curl/log evidence                       |
| RLS policy       | SQL output of `select * from pg_policies where ...`     |
| Storage          | Bucket name + signed URL test                           |
| Realtime         | Console log of received `postgres_changes` payload      |
| WebRTC           | Network trace showing ICE + media flow                  |
| Admin/security   | Audit log row + denied-by-role test                     |

## Tracker ownership

Each tracker has a single canonical file under `trackers/`. Phases may
append rows but MUST NOT split a tracker across multiple files.