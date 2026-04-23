import { z } from 'zod';

/**
 * Zod schemas for the Identity domain (P7.1).
 * Mirror the column constraints in the migration so client-side validation
 * matches the database. Used by forms (react-hook-form resolvers) and by
 * the data hooks before any insert / update lands at the server.
 */

export const profileUpdateSchema = z.object({
  display_name: z.string().min(1, 'Display name is required').max(100).nullable().optional(),
  username: z
    .string()
    .regex(/^[a-z0-9_-]{3,30}$/i, '3–30 chars, letters/numbers/_/- only')
    .nullable()
    .optional(),
  headline: z.string().max(200).nullable().optional(),
  bio: z.string().max(2000).nullable().optional(),
  avatar_url: z.string().url('Must be a valid URL').nullable().optional(),
  location: z.string().max(120).nullable().optional(),
  website: z.string().url('Must be a valid URL').nullable().optional(),
  is_public: z.boolean().optional(),
});
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export const userSettingsUpdateSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']).optional(),
  locale: z.string().min(2).max(10).optional(),
  timezone: z.string().min(1).max(60).optional(),
  email_notifications: z.boolean().optional(),
  push_notifications: z.boolean().optional(),
  marketing_opt_in: z.boolean().optional(),
  preferences: z.record(z.string(), z.unknown()).optional(),
});
export type UserSettingsUpdateInput = z.infer<typeof userSettingsUpdateSchema>;

export const professionalProfileUpsertSchema = z.object({
  title: z.string().max(120).nullable().optional(),
  is_for_hire: z.boolean().optional(),
  hourly_rate_cents: z.number().int().min(0).nullable().optional(),
  currency: z.string().length(3).optional(),
  years_experience: z.number().int().min(0).max(80).nullable().optional(),
  availability: z.string().max(60).nullable().optional(),
  skills: z.array(z.string().min(1).max(60)).max(50).optional(),
  languages: z.array(z.string().min(1).max(60)).max(20).optional(),
  github_url: z.string().url().nullable().optional(),
  linkedin_url: z.string().url().nullable().optional(),
  portfolio_url: z.string().url().nullable().optional(),
});
export type ProfessionalProfileUpsertInput = z.infer<typeof professionalProfileUpsertSchema>;

export const organizationCreateSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9-]{3,40}$/, 'Lowercase letters, numbers, dashes only (3–40 chars)'),
  name: z.string().min(1).max(120),
  slug: z
    .string()
    .regex(/^[a-z0-9-]{3,40}$/, 'Lowercase letters, numbers, dashes only (3–40 chars)'),
  about: z.string().max(2000).nullable().optional(),
  website: z.string().url().nullable().optional(),
  industry: z.string().max(80).nullable().optional(),
  size: z.string().max(40).nullable().optional(),
  logo_url: z.string().url().nullable().optional(),
  is_public: z.boolean().optional(),
});
export type OrganizationCreateInput = z.infer<typeof organizationCreateSchema>;
