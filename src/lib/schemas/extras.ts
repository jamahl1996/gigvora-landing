/**
 * Zod schemas for the 8 backfill domain tables added in Phase 9.1:
 * proposals, contracts, groups, webinars, calls, webhooks, events,
 * mentorship_relationships. Schemas mirror DB CHECK / enum constraints.
 */
import { z } from 'zod';

/* ------- proposals ------- */
export const proposalCreateSchema = z.object({
  project_id: z.string().uuid(),
  cover_note: z.string().min(1).max(8000),
  bid_amount_cents: z.number().int().nonnegative().nullable().optional(),
  currency: z.string().length(3).default('USD'),
  timeline_days: z.number().int().positive().nullable().optional(),
  attachments: z.array(z.unknown()).default([]),
  organization_id: z.string().nullable().optional(),
});
export const proposalUpdateSchema = proposalCreateSchema.partial().extend({
  status: z.enum(['submitted','shortlisted','withdrawn','accepted','rejected']).optional(),
});
export type ProposalCreateInput = z.infer<typeof proposalCreateSchema>;
export type ProposalUpdateInput = z.infer<typeof proposalUpdateSchema>;

/* ------- contracts ------- */
export const contractCreateSchema = z.object({
  project_id: z.string().uuid().nullable().optional(),
  proposal_id: z.string().uuid().nullable().optional(),
  client_id: z.string().uuid(),
  provider_id: z.string().uuid(),
  organization_id: z.string().nullable().optional(),
  title: z.string().min(2).max(200),
  scope: z.string().default(''),
  total_amount_cents: z.number().int().nonnegative().nullable().optional(),
  currency: z.string().length(3).default('USD'),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  terms: z.record(z.unknown()).default({}),
});
export const contractUpdateSchema = contractCreateSchema.partial().extend({
  status: z.enum(['draft','sent','signed','active','completed','cancelled']).optional(),
});
export type ContractCreateInput = z.infer<typeof contractCreateSchema>;
export type ContractUpdateInput = z.infer<typeof contractUpdateSchema>;

/* ------- groups ------- */
export const groupUpsertSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().default(''),
  visibility: z.enum(['public','private','secret']).default('public'),
  cover_image_url: z.string().url().nullable().optional(),
  category: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
});
export type GroupUpsertInput = z.infer<typeof groupUpsertSchema>;

/* ------- webinars ------- */
export const webinarUpsertSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().nullable().optional(),
  description: z.string().default(''),
  starts_at: z.string(),
  ends_at: z.string().nullable().optional(),
  capacity: z.number().int().positive().nullable().optional(),
  meeting_url: z.string().url().nullable().optional(),
  cover_image_url: z.string().url().nullable().optional(),
  visibility: z.enum(['public','private']).default('public'),
  organization_id: z.string().nullable().optional(),
});
export type WebinarUpsertInput = z.infer<typeof webinarUpsertSchema>;

/* ------- calls ------- */
export const callCreateSchema = z.object({
  participant_ids: z.array(z.string().uuid()).min(1),
  kind: z.enum(['audio','video']).default('video'),
  metadata: z.record(z.unknown()).default({}),
});
export type CallCreateInput = z.infer<typeof callCreateSchema>;

/* ------- webhooks ------- */
export const webhookUpsertSchema = z.object({
  url: z.string().url(),
  secret: z.string().min(8),
  event_types: z.array(z.string()).default([]),
  active: z.boolean().default(true),
  description: z.string().nullable().optional(),
  organization_id: z.string().nullable().optional(),
});
export type WebhookUpsertInput = z.infer<typeof webhookUpsertSchema>;

/* ------- events ------- */
export const eventUpsertSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().default(''),
  starts_at: z.string(),
  ends_at: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  online_url: z.string().url().nullable().optional(),
  capacity: z.number().int().positive().nullable().optional(),
  visibility: z.enum(['public','private']).default('public'),
  cover_image_url: z.string().url().nullable().optional(),
  group_id: z.string().uuid().nullable().optional(),
  organization_id: z.string().nullable().optional(),
});
export type EventUpsertInput = z.infer<typeof eventUpsertSchema>;

/* ------- mentorship ------- */
export const mentorshipCreateSchema = z.object({
  mentor_id: z.string().uuid(),
  goals: z.string().default(''),
  cadence: z.enum(['weekly','biweekly','monthly','adhoc']).nullable().optional(),
});
export const mentorshipUpdateSchema = z.object({
  status: z.enum(['pending','active','paused','ended']).optional(),
  goals: z.string().optional(),
  cadence: z.enum(['weekly','biweekly','monthly','adhoc']).nullable().optional(),
});
export type MentorshipCreateInput = z.infer<typeof mentorshipCreateSchema>;
export type MentorshipUpdateInput = z.infer<typeof mentorshipUpdateSchema>;