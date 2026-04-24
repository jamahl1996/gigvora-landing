import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
const sb: any = supabase;
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import { jobUpsertSchema, type JobUpsertInput } from '@/lib/schemas/marketplace';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type JobRow = Tables<'jobs'>;

export interface JobListFilters {
  category?: string;
  remote?: 'onsite' | 'hybrid' | 'remote';
  employmentType?: string;
  skills?: string[];
  minSalary?: number;
  search?: string;
  limit?: number;
}

/** Public discovery — RLS limits results to status='published' for non-owners. */
export function useJobsList(filters: JobListFilters = {}) {
  return useQuery({
    queryKey: qk.jobs.list(filters as Record<string, unknown>),
    queryFn: async (): Promise<JobRow[]> => {
      let q = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(filters.limit ?? 50);
      if (filters.category) q = q.eq('category', filters.category);
      if (filters.remote) q = q.eq('remote_policy', filters.remote);
      if (filters.employmentType) q = q.eq('employment_type', filters.employmentType);
      if (filters.skills?.length) q = q.overlaps('skills', filters.skills);
      if (filters.minSalary !== undefined) q = q.gte('salary_min_cents', filters.minSalary);
      if (filters.search) q = q.ilike('title', `%${filters.search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useJob(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? qk.jobs.byId(id) : ['jobs', 'byId', 'none'],
    enabled: Boolean(id),
    queryFn: async (): Promise<JobRow | null> => {
      const { data, error } = await sb.from('jobs').select('*').eq('id', id!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

/** Caller's own jobs (any status) — RLS allows owner to see all stages. */
export function useMyJobs() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.jobs.mine,
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<JobRow[]> => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('owner_id', user!.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateJob() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: JobUpsertInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = jobUpsertSchema.parse(input);
      // `parsed.title` is guaranteed by Zod (.min(3)); the cast satisfies TS only.
      const row: TablesInsert<'jobs'> = { ...parsed, title: parsed.title, owner_id: user.id };
      const { data, error } = await sb.from('jobs').insert(row).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.jobs.all });
      qc.invalidateQueries({ queryKey: qk.jobs.mine });
    },
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: JobUpsertInput & { id: string }) => {
      const parsed = jobUpsertSchema.partial().parse(input);
      const update: TablesUpdate<'jobs'> = parsed;
      const { data, error } = await sb.from('jobs').update(update).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: qk.jobs.all });
      qc.invalidateQueries({ queryKey: qk.jobs.mine });
      if (data?.id) qc.invalidateQueries({ queryKey: qk.jobs.byId(data.id) });
    },
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb.from('jobs').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.jobs.all });
      qc.invalidateQueries({ queryKey: qk.jobs.mine });
    },
  });
}
