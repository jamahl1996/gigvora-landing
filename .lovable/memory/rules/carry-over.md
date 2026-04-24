---
name: Carry-over rule for domain builds
description: Any incomplete work in a domain must be tracked and finished alongside the next domain's build
type: preference
---
When building Gigvora domains sequentially: any item left incomplete in the current domain (missing pages, components, RLS, edge functions, tests, integrations, QA) must be carried over and completed in the next domain's loop. Maintain an explicit "Carry-over from Domain N-1" task list at the start of each new domain. Never silently drop incomplete work. Track in .lovable/memory/carry-over.md (running ledger).
