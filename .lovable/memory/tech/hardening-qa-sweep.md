---
name: Hardening QA Sweep
description: After every staged hardening sweep, run a cross-cutting QA grep before declaring completion
type: preference
---
**Rule:** Before declaring a staged hardening sweep "complete", always run this 4-check grep sweep across the whole repo and fix every hit found — even if it requires opening domains the current turn wasn't scoped to.

```bash
# 1. Positional audit.record calls (must use object form)
grep -rn "audit\.record(" apps/api-nest/src --include="*.ts" | grep -v "audit\.record({" | grep -v "//"

# 2. Stale dioProvider references in Flutter (must be apiClientProvider)
grep -rn "dioProvider" apps/mobile-flutter/lib --include="*.dart"

# 3. Service list methods returning bare repo arrays (must wrap in envelope)
grep -rn "return this\.repo\.list" apps/api-nest/src/modules --include="*.service.ts"

# 4. Flutter API files missing apiClientProvider import
for f in apps/mobile-flutter/lib/features/*/[a-z]*_api.dart; do
  grep -q "apiClientProvider" "$f" || echo "MISSING: $f"
done
```

**Why:** A previous "complete" claim missed Domain 04's envelope landing AND a stale `dioProvider` reference, plus envelope leftovers in 6 other domains (workspace, search, notifications, feed, network, companies). The plan checkbox is not the source of truth — the grep sweep is.

**How to apply:** When the user signals end-of-sweep ("until completion", "do the rest"), run the sweep at the *start* of the final turn AND at the *end* of every turn. If hits remain, treat them as Batch N+1 and close them inside the same turn before writing the summary.
