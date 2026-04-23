import { z } from 'zod';

export const threadCreateSchema = z.object({
  participant_ids: z.array(z.string().uuid()).min(2).max(50),
  subject: z.string().max(200).optional(),
});

export const messageCreateSchema = z.object({
  thread_id: z.string().uuid(),
  recipient_id: z.string().uuid(),
  body: z.string().min(1).max(10000),
  attachments: z.array(z.record(z.string(), z.unknown())).default([]),
});

export const notificationKindSchema = z.string().min(1).max(80);

export const notificationUpdateSchema = z.object({
  id: z.string().uuid(),
  read_at: z.string().datetime().nullable().optional(),
  seen_at: z.string().datetime().nullable().optional(),
});

export const savedItemKindSchema = z.enum([
  'post','gig','service','project','job','profile','organization','article','reel',
]);

export const savedItemCreateSchema = z.object({
  item_kind: savedItemKindSchema,
  item_id: z.string().min(1).max(255),
  collection: z.string().max(80).optional(),
  note: z.string().max(2000).optional(),
});

export type ThreadCreateInput = z.infer<typeof threadCreateSchema>;
export type MessageCreateInput = z.infer<typeof messageCreateSchema>;
export type SavedItemCreateInput = z.infer<typeof savedItemCreateSchema>;
export type SavedItemKind = z.infer<typeof savedItemKindSchema>;
