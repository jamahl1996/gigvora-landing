# Tracker 13 — Internal Admin Portal Capability Matrix

Admin terminal lives in an isolated shell with environment ribbon and
role switcher. Every admin capability MUST be enforced server-side.

## Schema

| Capability | Surface (admin route) | Server enforcement | Audit log table | Role(s) | Status | Phase | Evidence |
|------------|------------------------|--------------------|------------------|---------|--------|-------|----------|

## Rows

| Capability | Surface | Server enforcement | Audit log | Role(s) | Status | Phase | Evidence |
|------------|---------|--------------------|-----------|---------|--------|-------|----------|
| _Phase 01: tracker initialised._ | — | — | — | — | Not started | 01 | BLOCKERS.md#B-010 |