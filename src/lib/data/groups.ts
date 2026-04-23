import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import { groupUpsertSchema, type GroupUpsertInput } from '@/lib/schemas/extras';

export function useGroupsList(filters?: { visibility?: 'public' | 'private'; search?: string }) {
  return useQuery({
    queryKey: qk.groups.list(filters),
    queryFn: async () => {
      let q = supabase.from('groups').select('*').order('created_at', { ascending: false });
      if (filters?.visibility) q = q.eq('visibility', filters.visibility);
      if (filters?.search) q = q.ilike('name', `%${filters.search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useMyGroups() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.groups.mine,
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_members').select('group_id, role, groups(*)')
        .eq('user_id', user!.id);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useGroup(id: string | null) {
  return useQuery({
    queryKey: id ? qk.groups.byId(id) : ['groups','none'],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase.from('groups').select('*').eq('id', id!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateGroup() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: GroupUpsertInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = groupUpsertSchema.parse(input);
      const { data, error } = await supabase.from('groups').insert({
        owner_id: user.id,
        name: parsed.name,
        slug: parsed.slug ?? null,
        description: parsed.description,
        visibility: parsed.visibility,
        cover_image_url: parsed.cover_image_url ?? null,
        category: parsed.category ?? null,
        tags: parsed.tags,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.groups.all }),
  });
}

export function useJoinGroup() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (groupId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await supabase.from('group_members').insert({ group_id: groupId, user_id: user.id });
      if (error) throw error;
      return groupId;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.groups.mine }),
  });
}

export function useLeaveGroup() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (groupId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await supabase.from('group_members').delete()
        .eq('group_id', groupId).eq('user_id', user.id);
      if (error) throw error;
      return groupId;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.groups.mine }),
  });
}