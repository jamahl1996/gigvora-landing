import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import { projectUpsertSchema, type ProjectUpsertInput } from '@/lib/schemas/marketplace';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type ProjectRow = any;

export interface ProjectListFilters {
  category?: string;
  budgetType?: string;
  skills?: string[];
  search?: string;
  limit?: number;
}

/**
 * Public project marketplace. RLS already restricts to status in
 * (open, in_progress, completed) AND visibility='public' for non-members.
 */
export function useProjectsList(filters: ProjectListFilters = {}) {
  return useQuery({
    queryKey: qk.projects.list(filters as Record<string, unknown>),
    queryFn: async (): Promise<ProjectRow[]> => {
      let q = supabase
        .from('projects')
        .select('*')
        .in('status', ['open', 'in_progress'])
        .eq('visibility', 'public')
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(filters.limit ?? 50);
      if (filters.category) q = q.eq('category', filters.category);
      if (filters.budgetType) q = q.eq('budget_type', filters.budgetType);
      if (filters.skills?.length) q = q.overlaps('skills_required', filters.skills);
      if (filters.search) q = q.ilike('title', `%${filters.search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useProject(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? qk.projects.byId(id) : ['projects', 'byId', 'none'],
    enabled: Boolean(id),
    queryFn: async (): Promise<ProjectRow | null> => {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useMyProjects() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.projects.mine,
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<ProjectRow[]> => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user!.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateProject() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProjectUpsertInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = projectUpsertSchema.parse(input);
      const row: TablesInsert<'projects'> = { ...parsed, title: parsed.title, owner_id: user.id };
      const { data, error } = await supabase.from('projects').insert(row).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.projects.all });
      qc.invalidateQueries({ queryKey: qk.projects.mine });
    },
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: ProjectUpsertInput & { id: string }) => {
      const parsed = projectUpsertSchema.partial().parse(input);
      const update: TablesUpdate<'projects'> = parsed;
      const { data, error } = await supabase.from('projects').update(update).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: qk.projects.all });
      qc.invalidateQueries({ queryKey: qk.projects.mine });
      if (data?.id) qc.invalidateQueries({ queryKey: qk.projects.byId(data.id) });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.projects.all });
      qc.invalidateQueries({ queryKey: qk.projects.mine });
    },
  });
}
