import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import { threadCreateSchema, type ThreadCreateInput } from '@/lib/schemas/comms';

export function useMyThreads() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.threads.mine,
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('message_threads')
        .select('*')
        .contains('participant_ids', [user!.id])
        .order('last_message_at', { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useThread(id: string | undefined) {
  return useQuery({
    queryKey: id ? qk.threads.byId(id) : ['threads','none'],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('message_threads')
        .select('*')
        .eq('id', id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateThread() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ThreadCreateInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = threadCreateSchema.parse(input);
      const participants = Array.from(new Set([user.id, ...parsed.participant_ids]));
      const { data, error } = await supabase
        .from('message_threads')
        .insert({ participant_ids: participants, subject: parsed.subject ?? null })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.threads.mine }),
  });
}

export function useArchiveThread() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (threadId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      // Read-modify-write archived_by array (small array; race acceptable for archive UX)
      const { data: existing, error: e1 } = await supabase
        .from('message_threads')
        .select('archived_by')
        .eq('id', threadId)
        .single();
      if (e1) throw e1;
      const next = Array.from(new Set([...(existing?.archived_by ?? []), user.id]));
      const { error } = await supabase
        .from('message_threads')
        .update({ archived_by: next })
        .eq('id', threadId);
      if (error) throw error;
      return threadId;
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: qk.threads.byId(id) });
      qc.invalidateQueries({ queryKey: qk.threads.mine });
    },
  });
}
