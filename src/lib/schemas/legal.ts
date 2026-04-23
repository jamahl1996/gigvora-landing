import { z } from 'zod';

export const legalDocumentKindSchema = z.enum([
  'terms',
  'privacy',
  'cookies',
  'dpa',
  'msa',
  'community_guidelines',
]);
export type LegalDocumentKind = z.infer<typeof legalDocumentKindSchema>;

export const legalAcceptanceCreateSchema = z.object({
  document_kind: legalDocumentKindSchema,
  document_version: z.string().min(1).max(32),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
export type LegalAcceptanceCreateInput = z.infer<typeof legalAcceptanceCreateSchema>;
