---
name: rebuild-rules
description: Always-apply build rules for Gigvora rebuild (real Supabase, no mock data, BYO Stripe, full-domain coverage).
type: preference
---
- Use this user's own Supabase project (ref `fvmbtmizxiwqdlrxuygh`) for ALL persistence. Do NOT use Lovable Cloud.
- No mock data anywhere except clearly-marked demo seeds. All UI reads from Supabase via real queries / realtime / edge functions.
- Payments: bring-your-own Stripe. Use Supabase Edge Functions for Checkout + webhooks. Never expose service role key.
- Auth: real Supabase auth (email+password, Google OAuth). Profiles + user_roles + has_role(); RLS on all user data.
- Build the full spec — 15-matrix trackers + 100+ domains. Always ALWAYS read mem://references/spec and mem://references/spec-v4 and mem://references/rebuild-plan in full before starting a new domain.
- After finishing/leaving a domain: complete it in full first (DB + RLS + UI + edge fn if needed + QA), then move to next.
- Storage: `avatars` and `post-media` buckets are public-read by design.
- Excel tracker workbook lives at /mnt/documents/Gigvora_Trackers.xlsx and mirrors Supabase trackers.
