---
name: Domain Throughput Per Turn
description: Default to closing 3 domains per turn end-to-end during staged hardening sweeps; never re-ask between turns
type: preference
---
**Rule:** When the user has authorised a staged hardening sweep (e.g. `.lovable/hardening-plan.md`) and sends "continue" / "do the rest" / "until completion":

1. **Default throughput is 3 domains per turn**, each closed end-to-end (backend hardening + Flutter screens + routes + doc + plan tick + memory rule when applicable).
2. If the user explicitly states a different number ("1 at a time", "5 per turn", "all in one"), honour that for subsequent turns and update this rule.
3. Stage the work inside the turn:
   - Backend service envelopes / audit / RBAC patches first (parallel where safe).
   - Flutter API + providers + screens for each domain (one block of writes per domain).
   - Router additions (single edit, all 3 domains' routes).
   - Plan + docs + memory updates last.
4. **Never re-ask** between turns when the standing instruction is "continue". Auto-pick the next 3 unchecked domains in the plan.
5. Each turn must green-build standalone. If a parallel edit fails (line numbers stale), re-view and retry sequentially before ending the turn.
6. **AuditService signature** is the object form: `audit.record({ actorId, domain, action, targetType, targetId, meta, ip?, ua? })`. Never use positional args — that's a bug.
7. **`apiClientProvider`** (NOT `dioProvider`) is the canonical Dio provider in `core/api_client.dart`. Fix any `ref.read(dioProvider)` you encounter.
8. **Envelope shape**: list endpoints return `{ items, total, limit, hasMore }`. Mobile readers must extract `data['items']`, never assume the response is a bare list.

**Why:** The user has explicitly asked for 3-at-a-time throughput. Staying at 1 per turn wastes their time when the foundation is already in place. Going beyond 3 risks truncation and orphan files.
