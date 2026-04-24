import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
const sb: any = supabase;
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import {
  userSettingsUpdateSchema,
  type UserSettingsUpdateInput,
} from '@/lib/schemas/identity';
import type { Tables, TablesUpdate } from '@/integrations/supabase/types';

export type UserSettingsRow = Tables<'user_settings'>;

/**
 * Caller's settings row. Auto-created on signup by the identity trigger.
 * RLS restricts visibility strictly to the owner.
 */
export function useMyUserSettings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.userSettings.me,
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<UserSettingsRow | null> => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateMyUserSettings() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UserSettingsUpdateInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = userSettingsUpdateSchema.parse(input);
      // Cast preferences (Record<string, unknown>) to Json shape Supabase expects.
      const update: any = {
        ...parsed,
        preferences: parsed.preferences as any['preferences'],
      };
      const { data, error } = await supabase
        .from('user_settings')
        .update(update)
        .eq('user_id', user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.userSettings.me });
    },
  });
}
