import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import { serviceUpsertSchema, type ServiceUpsertInput } from '@/lib/schemas/marketplace';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type ServiceRow = Tables<'services'>;

export interface ServiceListFilters {
  category?: string;
  pricingModel?: 'hourly' | 'retainer' | 'project' | 'custom';
  tags?: string[];
  search?: string;
  limit?: number;
}

export function useServicesList(filters: ServiceListFilters = {}) {
  return useQuery({
    queryKey: qk.services.list(filters as Record<string, unknown>),
    queryFn: async (): Promise<ServiceRow[]> => {
      let q = supabase
        .from('services')
        .select('*')
        .eq('status', 'published')
        .order('rating_avg', { ascending: false, nullsFirst: false })
        .limit(filters.limit ?? 50);
      if (filters.category) q = q.eq('category', filters.category);
      if (filters.pricingModel) q = q.eq('pricing_model', filters.pricingModel);
      if (filters.tags?.length) q = q.overlaps('tags', filters.tags);
      if (filters.search) q = q.ilike('title', `%${filters.search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useService(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? qk.services.byId(id) : ['services', 'byId', 'none'],
    enabled: Boolean(id),
    queryFn: async (): Promise<ServiceRow | null> => {
      const { data, error } = await supabase.from('services').select('*').eq('id', id!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useMyServices() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.services.mine,
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<ServiceRow[]> => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('owner_id', user!.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateService() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ServiceUpsertInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = serviceUpsertSchema.parse(input);
      const row: TablesInsert<'services'> = { ...parsed, title: parsed.title, owner_id: user.id };
      const { data, error } = await supabase.from('services').insert(row).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.services.all });
      qc.invalidateQueries({ queryKey: qk.services.mine });
    },
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: ServiceUpsertInput & { id: string }) => {
      const parsed = serviceUpsertSchema.partial().parse(input);
      const update: TablesUpdate<'services'> = parsed;
      const { data, error } = await supabase.from('services').update(update).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: qk.services.all });
      qc.invalidateQueries({ queryKey: qk.services.mine });
      if (data?.id) qc.invalidateQueries({ queryKey: qk.services.byId(data.id) });
    },
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.services.all });
      qc.invalidateQueries({ queryKey: qk.services.mine });
    },
  });
}
