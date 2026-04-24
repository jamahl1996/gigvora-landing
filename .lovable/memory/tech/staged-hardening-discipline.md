---
name: Staged Hardening Discipline
description: Multi-turn execution rule for any sweep that would otherwise overflow a single turn — always stage to guarantee every turn green-builds
type: preference
---
**Rule:** When a request spans many domains or would require more files than can be safely produced in one turn (rough budget: ~25 file writes per turn), do NOT attempt a mega-turn. Instead:

1. **Land the foundation first** — shared packages, base modules, infra, shared widget kits, router refactors. Never leave a foundation half-written.
2. **Then close ONE domain per follow-up turn** end-to-end against that foundation, to the Enterprise Build Standard + Mobile Screens Mandate Definition of Done.
3. **Track progress in `.lovable/hardening-plan.md`** (or the equivalent companion plan file). Update it every turn: mark what landed, what is next.
4. **Each turn must green-build on its own** — no dangling imports, no orphan dependencies, no half-written files. If a dep is added in turn N, it must be wired and consumed in turn N.
5. **Auto-continue** — when the user says "continue" / "do the rest" / "until completion", interpret that as authorisation to keep executing the staged plan one domain per turn without re-asking, until every domain in the plan is at the Definition of Done.
6. **Never respond with "no changes needed" or shallow scaffolding** for a domain in the plan. If a domain is genuinely already at the bar, prove it in the turn's summary by listing the Enterprise Build Standard checklist and the Mobile Screens Mandate file list.

**Why:** A single tool turn cannot safely emit ~300+ files without truncation. Staging is the only way to keep the "no scaffolds, enterprise + institutional bar" rule honest in practice.
