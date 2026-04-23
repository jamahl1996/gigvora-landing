# Memory: index.md
Updated: now

# Project Memory

## Core
Project: Gigvora — enterprise multi-sided platform (marketplace, hiring, work mgmt, social feed, finance, AI). Brand: black wordmark with blue (#1F7AFF / oklch ~0.62 0.22 255) ring "o". Bg white, Inter font, Apple-clean minimal.
ALWAYS read full spec at mem://references/spec, mem://references/spec-v4, mem://references/rebuild-plan before any domain work.
Backend: USER'S OWN Supabase (ref fvmbtmizxiwqdlrxuygh). NEVER use Lovable Cloud. Payments: BYO Stripe via Supabase Edge Functions.
No mock data in production paths — all UI must read real data from Supabase. Demo seeds must be clearly labeled.
Auth: profiles + user_roles + has_role() + RLS everywhere. Roles: user/pro/enterprise/moderator/admin.
Use shadcn semantic tokens; never hardcode colors. Pill buttons, 2xl cards, motion 150–300ms cubic-bezier(.2,.7,.2,1).

## Memories
- [Spec reference](mem://references/spec) — Gigvora_Product_Control_Spec_v3.docx (100 domains × 17 sections × 5 levels)
- [Spec v4](mem://references/spec-v4) — Gigvora_Product_Control_Spec_v4_Rebuild_Master.docx (112 domains, 9500-cell matrix)
- [Rebuild plan](mem://references/rebuild-plan) — Gigvora_Product_Control_Spec_v3_1.docx
- [Rebuild rules](mem://rebuild-rules) — Real Supabase, no mock data, BYO Stripe, full-domain coverage
