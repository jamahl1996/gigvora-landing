import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import {
  professionalProfileUpsertSchema,
  type ProfessionalProfileUpsertInput,
} from '@/lib/schemas/identity';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type ProfessionalProfileRow = any;

export interface ForHireFilters {
  skills?: string[];
  minRate?: number;
  maxRate?: number;
  availability?: string;
  limit?: number;
}

/** Public discovery: pros marked `is_for_hire = true`. */
export function useProfessionalsForHire(filters: ForHireFilters = {}) {
  return useQuery({
    queryKey: qk.professionalProfiles.forHire(filters as Record<string, unknown>),
    queryFn: async (): Promise<ProfessionalProfileRow[]> => {
      let q = supabase
        .from('professional_profiles')
        .select('*')
        .eq('is_for_hire', true)
        .order('rating_avg', { ascending: false, nullsFirst: false })
        .limit(filters.limit ?? 50);

      if (filters.skills?.length) q = q.overlaps('skills', filters.skills);
      if (filters.minRate !== undefined) q = q.gte('hourly_rate_cents', filters.minRate);
      if (filters.maxRate !== undefined) q = q.lte('hourly_rate_cents', filters.maxRate);
      if (filters.availability) q = q.eq('availability', filters.availability);

      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Caller's own pro profile (may not yet exist — first save creates it). */
export function useMyProfessionalProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.professionalProfiles.me,
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<ProfessionalProfileRow | null> => {
      const { data, error } = await supabase
        .from('professional_profiles')
        .select('*')
        .eq('id', user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

/**
 * Upsert the caller's pro profile. The PK `id` equals `auth.uid()`.
 * RLS guarantees the caller can only touch their own row.
 */
export function useUpsertMyProfessionalProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProfessionalProfileUpsertInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = professionalProfileUpsertSchema.parse(input);
      const row: TablesInsert<'professional_profiles'> = { id: user.id, ...parsed };
      const { data, error } = await supabase
        .from('professional_profiles')
        .upsert(row, { onConflict: 'id' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.professionalProfiles.me });
      qc.invalidateQueries({ queryKey: qk.professionalProfiles.all });
    },
  });
}
