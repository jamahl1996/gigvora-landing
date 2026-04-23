import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import { profileUpdateSchema, type ProfileUpdateInput } from '@/lib/schemas/identity';
import type { Tables, TablesUpdate } from '@/integrations/supabase/types';

export type ProfileRow = Tables<'profiles'>;

/**
 * Fetch a single profile by user id.
 * Public profiles are visible to everyone via RLS; private ones only to owner.
 */
export function useProfile(userId: string | null | undefined) {
  return useQuery({
    queryKey: userId ? qk.profiles.byId(userId) : ['profiles', 'byId', 'none'],
    enabled: Boolean(userId),
    queryFn: async (): Promise<ProfileRow | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

/**
 * The current authenticated user's own profile. Auto-created by the
 * `handle_new_user_identity` trigger on signup, but may temporarily be
 * absent during the first render — `maybeSingle()` returns null safely.
 */
export function useMyProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.profiles.me,
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<ProfileRow | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

/**
 * Update the caller's profile. RLS enforces `id = auth.uid()`.
 * On success, invalidates both `profiles.me` and `profiles.byId(userId)`
 * so any rendered profile card refreshes.
 */
export function useUpdateMyProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProfileUpdateInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = profileUpdateSchema.parse(input);
      const update: TablesUpdate<'profiles'> = parsed;
      const { data, error } = await supabase
        .from('profiles')
        .update(update)
        .eq('id', user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: qk.profiles.me });
      if (data?.id) qc.invalidateQueries({ queryKey: qk.profiles.byId(data.id) });
    },
  });
}
