import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import {
  proposalCreateSchema, proposalUpdateSchema,
  type ProposalCreateInput, type ProposalUpdateInput,
} from '@/lib/schemas/extras';

export function useProposalsForProject(projectId: string | null) {
  return useQuery({
    queryKey: projectId ? qk.proposals.byProject(projectId) : ['proposals','none'],
    enabled: Boolean(projectId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposals').select('*')
        .eq('project_id', projectId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useMyProposals() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.proposals.mine,
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposals').select('*')
        .eq('freelancer_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateProposal() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProposalCreateInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = proposalCreateSchema.parse(input);
      const { data, error } = await supabase.from('proposals').insert({
        project_id: parsed.project_id,
        cover_note: parsed.cover_note,
        bid_amount_cents: parsed.bid_amount_cents ?? null,
        currency: parsed.currency,
        timeline_days: parsed.timeline_days ?? null,
        attachments: parsed.attachments as any,
        organization_id: parsed.organization_id ?? null,
        freelancer_id: user.id,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (row) => {
      qc.invalidateQueries({ queryKey: qk.proposals.mine });
      if (row?.project_id) qc.invalidateQueries({ queryKey: qk.proposals.byProject(row.project_id) });
    },
  });
}

export function useUpdateProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: string; patch: ProposalUpdateInput }) => {
      const parsed = proposalUpdateSchema.parse(args.patch);
      const { attachments, ...rest } = parsed;
      const { data, error } = await supabase.from('proposals')
        .update({ ...rest, ...(attachments ? { attachments: attachments as any } : {}) })
        .eq('id', args.id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['proposals'] }),
  });
}

export function useWithdrawProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('proposals').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['proposals'] }),
  });
}