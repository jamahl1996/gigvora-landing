import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';

export function useFollowers(userId: string | undefined) {
  return useQuery({
    queryKey: userId ? qk.follows.followers(userId) : ['follows','followers','none'],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follows')
        .select('*')
        .eq('followee_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useFollowing(userId: string | undefined) {
  return useQuery({
    queryKey: userId ? qk.follows.following(userId) : ['follows','following','none'],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useIsFollowing(followeeId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: followeeId ? qk.follows.isFollowing(followeeId) : ['follows','isFollowing','none'],
    enabled: Boolean(user?.id && followeeId),
    queryFn: async (): Promise<boolean> => {
      const { data, error } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('follower_id', user!.id)
        .eq('followee_id', followeeId!)
        .maybeSingle();
      if (error) throw error;
      return Boolean(data);
    },
  });
}

export function useFollow() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (followeeId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('follows')
        .insert({ follower_id: user.id, followee_id: followeeId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, followeeId) => {
      qc.invalidateQueries({ queryKey: qk.follows.isFollowing(followeeId) });
      qc.invalidateQueries({ queryKey: qk.follows.following(user!.id) });
      qc.invalidateQueries({ queryKey: qk.follows.followers(followeeId) });
    },
  });
}

export function useUnfollow() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (followeeId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('followee_id', followeeId);
      if (error) throw error;
      return followeeId;
    },
    onSuccess: (followeeId) => {
      qc.invalidateQueries({ queryKey: qk.follows.isFollowing(followeeId) });
      qc.invalidateQueries({ queryKey: qk.follows.following(user!.id) });
      qc.invalidateQueries({ queryKey: qk.follows.followers(followeeId) });
    },
  });
}
