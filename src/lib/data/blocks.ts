import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import { blockCreateSchema, type BlockCreateInput } from '@/lib/schemas/social';

export function useMyBlocks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.blocks.mine,
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_blocks')
        .select('*')
        .eq('blocker_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useBlockUser() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: BlockCreateInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = blockCreateSchema.parse(input);
      const { data, error } = await supabase
        .from('user_blocks')
        .insert({ blocker_id: user.id, blocked_id: parsed.blocked_id, reason: parsed.reason ?? null })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.blocks.mine }),
  });
}

export function useUnblockUser() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (blockedId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('user_blocks')
        .delete()
        .eq('blocker_id', user.id)
        .eq('blocked_id', blockedId);
      if (error) throw error;
      return blockedId;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.blocks.mine }),
  });
}
