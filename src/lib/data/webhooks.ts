import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import { webhookUpsertSchema, type WebhookUpsertInput } from '@/lib/schemas/extras';

export function useMyWebhooks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.webhooks.mine,
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase.from('webhooks').select('*')
        .eq('owner_id', user!.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateWebhook() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: WebhookUpsertInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = webhookUpsertSchema.parse(input);
      const { data, error } = await supabase.from('webhooks').insert({
        owner_id: user.id,
        url: parsed.url,
        secret: parsed.secret,
        event_types: parsed.event_types,
        active: parsed.active,
        description: parsed.description ?? null,
        organization_id: parsed.organization_id ?? null,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.webhooks.mine }),
  });
}

export function useDeleteWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('webhooks').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.webhooks.mine }),
  });
}