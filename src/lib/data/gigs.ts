import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import { gigUpsertSchema, type GigUpsertInput } from '@/lib/schemas/marketplace';
import type { Tables, TablesInsert, TablesUpdate, Json } from '@/integrations/supabase/types';

export type GigRow = Tables<'gigs'>;

export interface GigListFilters {
  category?: string;
  tags?: string[];
  maxStartingPrice?: number;
  search?: string;
  limit?: number;
}

export function useGigsList(filters: GigListFilters = {}) {
  return useQuery({
    queryKey: qk.gigs.list(filters as Record<string, unknown>),
    queryFn: async (): Promise<GigRow[]> => {
      let q = supabase
        .from('gigs')
        .select('*')
        .eq('status', 'published')
        .order('rating_avg', { ascending: false, nullsFirst: false })
        .limit(filters.limit ?? 50);
      if (filters.category) q = q.eq('category', filters.category);
      if (filters.tags?.length) q = q.overlaps('tags', filters.tags);
      if (filters.maxStartingPrice !== undefined) q = q.lte('starting_price_cents', filters.maxStartingPrice);
      if (filters.search) q = q.ilike('title', `%${filters.search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useGig(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? qk.gigs.byId(id) : ['gigs', 'byId', 'none'],
    enabled: Boolean(id),
    queryFn: async (): Promise<GigRow | null> => {
      const { data, error } = await supabase.from('gigs').select('*').eq('id', id!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useMyGigs() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.gigs.mine,
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<GigRow[]> => {
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('owner_id', user!.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateGig() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: GigUpsertInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = gigUpsertSchema.parse(input);
      const row: TablesInsert<'gigs'> = {
        ...parsed,
        title: parsed.title,
        owner_id: user.id,
        tiers: parsed.tiers as unknown as Json,
        gallery: parsed.gallery as unknown as Json,
      };
      const { data, error } = await supabase.from('gigs').insert(row).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.gigs.all });
      qc.invalidateQueries({ queryKey: qk.gigs.mine });
    },
  });
}

export function useUpdateGig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: GigUpsertInput & { id: string }) => {
      const parsed = gigUpsertSchema.partial().parse(input);
      const update: TablesUpdate<'gigs'> = {
        ...parsed,
        tiers: parsed.tiers as unknown as Json | undefined,
        gallery: parsed.gallery as unknown as Json | undefined,
      };
      const { data, error } = await supabase.from('gigs').update(update).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: qk.gigs.all });
      qc.invalidateQueries({ queryKey: qk.gigs.mine });
      if (data?.id) qc.invalidateQueries({ queryKey: qk.gigs.byId(data.id) });
    },
  });
}

export function useDeleteGig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gigs').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.gigs.all });
      qc.invalidateQueries({ queryKey: qk.gigs.mine });
    },
  });
}
