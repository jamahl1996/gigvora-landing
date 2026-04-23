import { z } from 'zod';

/**
 * Zod schemas for the Work Execution domain (P7.3):
 * tasks, milestones, deliverables, time_entries.
 */

export const taskUpsertSchema = z.object({
  project_id: z.string().uuid(),
  parent_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(20000).optional(),
  assignee_id: z.string().uuid().nullable().optional(),
  status: z.enum(['todo', 'in_progress', 'in_review', 'blocked', 'done', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  position: z.number().int().min(0).optional(),
  estimate_hours: z.number().min(0).max(10000).nullable().optional(),
  due_at: z.string().datetime().nullable().optional(),
  tags: z.array(z.string().min(1).max(60)).max(20).optional(),
});
export type TaskUpsertInput = z.infer<typeof taskUpsertSchema>;

export const milestoneUpsertSchema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(20000).optional(),
  amount_cents: z.number().int().min(0).nullable().optional(),
  currency: z.string().length(3).optional(),
  status: z.enum(['planned', 'active', 'submitted', 'approved', 'paid', 'cancelled']).optional(),
  position: z.number().int().min(0).optional(),
  due_at: z.string().datetime().nullable().optional(),
});
export type MilestoneUpsertInput = z.infer<typeof milestoneUpsertSchema>;

export const deliverableUpsertSchema = z.object({
  project_id: z.string().uuid(),
  milestone_id: z.string().uuid().nullable().optional(),
  task_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1).max(200),
  notes: z.string().max(20000).optional(),
  files: z.array(z.record(z.string(), z.unknown())).max(50).optional(),
  links: z.array(z.record(z.string(), z.unknown())).max(50).optional(),
  status: z.enum(['pending', 'submitted', 'approved', 'rejected', 'revision_requested']).optional(),
});
export type DeliverableUpsertInput = z.infer<typeof deliverableUpsertSchema>;

export const timeEntryUpsertSchema = z.object({
  project_id: z.string().uuid(),
  task_id: z.string().uuid().nullable().optional(),
  description: z.string().max(2000).optional(),
  started_at: z.string().datetime(),
  ended_at: z.string().datetime().nullable().optional(),
  duration_seconds: z.number().int().min(0).nullable().optional(),
  billable: z.boolean().optional(),
  hourly_rate_cents: z.number().int().min(0).nullable().optional(),
  currency: z.string().length(3).optional(),
});
export type TimeEntryUpsertInput = z.infer<typeof timeEntryUpsertSchema>;
