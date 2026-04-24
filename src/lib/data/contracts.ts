import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import {
  contractCreateSchema, contractUpdateSchema,
  type ContractCreateInput, type ContractUpdateInput,
} from '@/lib/schemas/extras';

export function useMyContracts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.contracts.mine,
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contracts').select('*')
        .or(`client_id.eq.${user!.id},provider_id.eq.${user!.id}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useContract(id: string | null) {
  return useQuery({
    queryKey: id ? qk.contracts.byId(id) : ['contracts','none'],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await (supabase as any).from('contracts').select('*').eq('id', id!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ContractCreateInput) => {
      const parsed = contractCreateSchema.parse(input);
      const { data, error } = await (supabase as any).from('contracts').insert({
        client_id: parsed.client_id,
        provider_id: parsed.provider_id,
        title: parsed.title,
        scope: parsed.scope,
        currency: parsed.currency,
        project_id: parsed.project_id ?? null,
        proposal_id: parsed.proposal_id ?? null,
        organization_id: parsed.organization_id ?? null,
        total_amount_cents: parsed.total_amount_cents ?? null,
        start_date: parsed.start_date ?? null,
        end_date: parsed.end_date ?? null,
        terms: parsed.terms as any,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.contracts.mine }),
  });
}

export function useUpdateContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: string; patch: ContractUpdateInput }) => {
      const parsed = contractUpdateSchema.parse(args.patch);
      const { terms, ...rest } = parsed;
      const { data, error } = await (supabase as any).from('contracts')
        .update({ ...rest, ...(terms ? { terms: terms as any } : {}) })
        .eq('id', args.id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contracts'] }),
  });
}

export function useSignContract() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: string; as: 'client' | 'provider' }) => {
      if (!user?.id) throw new Error('Not authenticated');
      const patch = args.as === 'client'
        ? { client_signed_at: new Date().toISOString() }
        : { provider_signed_at: new Date().toISOString() };
      const { data, error } = await (supabase as any).from('contracts').update(patch).eq('id', args.id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contracts'] }),
  });
}