import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
const sb: any = supabase;
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import {
  legalAcceptanceCreateSchema,
  type LegalAcceptanceCreateInput,
  type LegalDocumentKind,
} from '@/lib/schemas/legal';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type LegalAcceptanceRow = any;

/** All legal acceptances for the authenticated user. */
export function useMyLegalAcceptances() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.legalAcceptances.me,
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<LegalAcceptanceRow[]> => {
      const { data, error } = await supabase
        .from('legal_acceptances')
        .select('*')
        .eq('user_id', user!.id)
        .order('accepted_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** True if the caller has accepted the latest version of `kind`. */
export function useHasAcceptedLegal(kind: LegalDocumentKind, version: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.legalAcceptances.check(kind, version),
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<boolean> => {
      const { data, error } = await supabase
        .from('legal_acceptances')
        .select('id')
        .eq('user_id', user!.id)
        .eq('document_kind', kind)
        .eq('document_version', version)
        .maybeSingle();
      if (error) throw error;
      return Boolean(data);
    },
  });
}

export function useRecordLegalAcceptance() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LegalAcceptanceCreateInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = legalAcceptanceCreateSchema.parse(input);
      const row: TablesInsert<'legal_acceptances'> = {
        user_id: user.id,
        document_kind: parsed.document_kind,
        document_version: parsed.document_version,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        metadata: parsed.metadata as TablesInsert<'legal_acceptances'>['metadata'],
      };
      const { data, error } = await supabase
        .from('legal_acceptances')
        .insert(row)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.legalAcceptances.all });
    },
  });
}
