import { z } from 'zod';

export const reactionKindSchema = z.enum(['like','celebrate','support','insightful','curious']);
export type ReactionKind = z.infer<typeof reactionKindSchema>;

export const connectionRequestCreateSchema = z.object({
  recipient_id: z.string().uuid(),
  message: z.string().max(1000).optional(),
});

export const connectionRequestRespondSchema = z.object({
  status: z.enum(['accepted','declined','withdrawn']),
});

export const followCreateSchema = z.object({
  followee_id: z.string().uuid(),
});

export const blockCreateSchema = z.object({
  blocked_id: z.string().uuid(),
  reason: z.string().max(500).optional(),
});

export const postReactionCreateSchema = z.object({
  post_id: z.string().uuid(),
  kind: reactionKindSchema.default('like'),
});

export const postCommentCreateSchema = z.object({
  post_id: z.string().uuid(),
  parent_id: z.string().uuid().nullish(),
  body: z.string().min(1).max(4000),
});

export const postCommentUpdateSchema = z.object({
  id: z.string().uuid(),
  body: z.string().min(1).max(4000),
});

export type ConnectionRequestCreateInput = z.infer<typeof connectionRequestCreateSchema>;
export type FollowCreateInput = z.infer<typeof followCreateSchema>;
export type BlockCreateInput = z.infer<typeof blockCreateSchema>;
export type PostReactionCreateInput = z.infer<typeof postReactionCreateSchema>;
export type PostCommentCreateInput = z.infer<typeof postCommentCreateSchema>;
