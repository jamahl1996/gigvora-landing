import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import {
  savedItemCreateSchema,
  type SavedItemCreateInput,
  type SavedItemKind,
} from '@/lib/schemas/comms';

export function useMySavedItems(kind?: SavedItemKind) {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.savedItems.mine(kind),
    enabled: Boolean(user?.id),
    queryFn: async () => {
      let q = supabase
        .from('saved_items')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (kind) q = q.eq('item_kind', kind);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useIsSaved(itemKind: SavedItemKind | undefined, itemId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: itemKind && itemId ? qk.savedItems.isSaved(itemKind, itemId) : ['savedItems','isSaved','none'],
    enabled: Boolean(user?.id && itemKind && itemId),
    queryFn: async (): Promise<boolean> => {
      const { data, error } = await supabase
        .from('saved_items')
        .select('id')
        .eq('user_id', user!.id)
        .eq('item_kind', itemKind!)
        .eq('item_id', itemId!)
        .maybeSingle();
      if (error) throw error;
      return Boolean(data);
    },
  });
}

export function useSaveItem() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: SavedItemCreateInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = savedItemCreateSchema.parse(input);
      const { data, error } = await supabase
        .from('saved_items')
        .insert({
          user_id: user.id,
          item_kind: parsed.item_kind,
          item_id: parsed.item_id,
          collection: parsed.collection ?? null,
          note: parsed.note ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['savedItems'] });
      qc.invalidateQueries({ queryKey: qk.savedItems.isSaved(vars.item_kind, vars.item_id) });
    },
  });
}

export function useUnsaveItem() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemKind, itemId }: { itemKind: SavedItemKind; itemId: string }) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('saved_items')
        .delete()
        .eq('user_id', user.id)
        .eq('item_kind', itemKind)
        .eq('item_id', itemId);
      if (error) throw error;
      return { itemKind, itemId };
    },
    onSuccess: ({ itemKind, itemId }) => {
      qc.invalidateQueries({ queryKey: ['savedItems'] });
      qc.invalidateQueries({ queryKey: qk.savedItems.isSaved(itemKind, itemId) });
    },
  });
}
