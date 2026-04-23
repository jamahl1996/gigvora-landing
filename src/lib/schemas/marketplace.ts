import { z } from 'zod';

/**
 * Zod schemas for the Commercial Marketplace domain (P7.2):
 * jobs, gigs, services, projects. Mirror migration column constraints.
 */

const slugSchema = z
  .string()
  .regex(/^[a-z0-9-]{3,80}$/, 'Lowercase letters, numbers, dashes only (3–80 chars)')
  .nullable()
  .optional();

export const jobUpsertSchema = z.object({
  title: z.string().min(3).max(200),
  slug: slugSchema,
  description: z.string().max(20000).optional(),
  category: z.string().max(80).nullable().optional(),
  employment_type: z.enum(['full_time', 'part_time', 'contract', 'internship', 'temporary']).optional(),
  remote_policy: z.enum(['onsite', 'hybrid', 'remote']).optional(),
  location: z.string().max(160).nullable().optional(),
  salary_min_cents: z.number().int().min(0).nullable().optional(),
  salary_max_cents: z.number().int().min(0).nullable().optional(),
  currency: z.string().length(3).optional(),
  skills: z.array(z.string().min(1).max(60)).max(50).optional(),
  status: z.enum(['draft', 'published', 'closed', 'archived']).optional(),
  organization_id: z.string().nullable().optional(),
  closes_at: z.string().datetime().nullable().optional(),
});
export type JobUpsertInput = z.infer<typeof jobUpsertSchema>;

export const gigUpsertSchema = z.object({
  title: z.string().min(3).max(200),
  slug: slugSchema,
  description: z.string().max(20000).optional(),
  category: z.string().max(80).nullable().optional(),
  tags: z.array(z.string().min(1).max(60)).max(20).optional(),
  cover_image_url: z.string().url().nullable().optional(),
  starting_price_cents: z.number().int().min(0).nullable().optional(),
  currency: z.string().length(3).optional(),
  tiers: z.array(z.record(z.string(), z.unknown())).max(10).optional(),
  gallery: z.array(z.record(z.string(), z.unknown())).max(20).optional(),
  status: z.enum(['draft', 'published', 'paused', 'archived']).optional(),
});
export type GigUpsertInput = z.infer<typeof gigUpsertSchema>;

export const serviceUpsertSchema = z.object({
  title: z.string().min(3).max(200),
  slug: slugSchema,
  summary: z.string().max(500).optional(),
  description: z.string().max(20000).optional(),
  category: z.string().max(80).nullable().optional(),
  tags: z.array(z.string().min(1).max(60)).max(20).optional(),
  cover_image_url: z.string().url().nullable().optional(),
  pricing_model: z.enum(['hourly', 'retainer', 'project', 'custom']).optional(),
  hourly_rate_cents: z.number().int().min(0).nullable().optional(),
  retainer_cents: z.number().int().min(0).nullable().optional(),
  currency: z.string().length(3).optional(),
  status: z.enum(['draft', 'published', 'paused', 'archived']).optional(),
});
export type ServiceUpsertInput = z.infer<typeof serviceUpsertSchema>;

export const projectUpsertSchema = z.object({
  title: z.string().min(3).max(200),
  slug: slugSchema,
  category: z.string().max(80).nullable().optional(),
  brief: z.string().max(20000).optional(),
  skills_required: z.array(z.string().min(1).max(60)).max(50).optional(),
  budget_type: z.enum(['fixed', 'hourly', 'range', 'retainer']).optional(),
  budget_min_cents: z.number().int().min(0).nullable().optional(),
  budget_max_cents: z.number().int().min(0).nullable().optional(),
  currency: z.string().length(3).optional(),
  duration: z.string().max(80).nullable().optional(),
  visibility: z.enum(['public', 'private', 'invite_only']).optional(),
  status: z.enum(['draft', 'open', 'in_progress', 'completed', 'cancelled']).optional(),
  organization_id: z.string().nullable().optional(),
  closes_at: z.string().datetime().nullable().optional(),
});
export type ProjectUpsertInput = z.infer<typeof projectUpsertSchema>;
