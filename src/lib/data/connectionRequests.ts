import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import {
  connectionRequestCreateSchema,
  type ConnectionRequestCreateInput,
} from '@/lib/schemas/social';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type ConnectionRequestRow = Tables<'connection_requests'>;

export function useIncomingConnectionRequests() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.connectionRequests.incoming,
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('recipient_id', user!.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useOutgoingConnectionRequests() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.connectionRequests.outgoing,
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('requester_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSendConnectionRequest() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ConnectionRequestCreateInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = connectionRequestCreateSchema.parse(input);
      const row: TablesInsert<'connection_requests'> = {
        requester_id: user.id,
        recipient_id: parsed.recipient_id,
        message: parsed.message ?? null,
      };
      const { data, error } = await supabase
        .from('connection_requests')
        .insert(row)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['connectionRequests'] });
    },
  });
}

export function useRespondToConnectionRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'accepted' | 'declined' | 'withdrawn' }) => {
      const { data, error } = await supabase
        .from('connection_requests')
        .update({ status, responded_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['connectionRequests'] });
      qc.invalidateQueries({ queryKey: qk.connections.me });
    },
  });
}
