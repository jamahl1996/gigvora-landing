import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import { callCreateSchema, type CallCreateInput } from '@/lib/schemas/extras';

export function useMyCalls(limit = 50) {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.calls.mine,
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await (supabase as any).from('calls').select('*')
        .or(`initiator_id.eq.${user!.id},participant_ids.cs.{${user!.id}}`)
        .order('created_at', { ascending: false }).limit(limit);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useStartCall() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CallCreateInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = callCreateSchema.parse(input);
      const { data, error } = await (supabase as any).from('calls').insert({
        initiator_id: user.id,
        participant_ids: parsed.participant_ids,
        kind: parsed.kind,
        metadata: parsed.metadata as any,
        started_at: new Date().toISOString(),
        status: 'active',
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.calls.mine }),
  });
}

export function useEndCall() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: string; durationSeconds?: number }) => {
      const { data, error } = await (supabase as any).from('calls').update({
        status: 'ended',
        ended_at: new Date().toISOString(),
        duration_seconds: args.durationSeconds ?? null,
      }).eq('id', args.id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.calls.mine }),
  });
}