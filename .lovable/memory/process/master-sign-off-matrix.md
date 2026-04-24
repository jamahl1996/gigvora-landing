---
name: Master Sign-Off Matrix
description: Binding 13-gate release ledger at docs/qa/MASTER-SIGN-OFF-MATRIX.md. All D-domain Run 2/3/4 work must update gate rows with evidence; no gate flips green from code-generation alone.
type: feature
---

The canonical release gate is `docs/qa/MASTER-SIGN-OFF-MATRIX.md`. It enumerates 13 sign-off gates (G01 Supabase removal → G13 Final docs/release package) plus the 5 Master Sign-Off Rules.

Binding rules:
- No gate may be ticked merely because code was generated. Completion requires: repo evidence + working `src/routes/*` (not just `src/pages/*`) + integrated real data + valid runtime config + observable browser/terminal success.
- All site-map pages must be accounted for; absorbed pages logged explicitly.
- All creation flows (jobs/gigs/projects/settings/webinars/podcasts/videos/reels) must hit the 10-step enterprise wizard baseline.
- All media players/editors must be operational. **Reels = special priority** for mobile interaction quality.
- Release blocked until security + speed + compliance + mobile parity + final docs are all evidenced.

Domain→gate map exists in the same file. Every D-domain Run 2/3/4 closure must update the matching gate row with evidence links before claiming progress.
