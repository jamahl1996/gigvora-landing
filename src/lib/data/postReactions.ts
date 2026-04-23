import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import {
  postReactionCreateSchema,
  type PostReactionCreateInput,
  type ReactionKind,
} from '@/lib/schemas/social';

export function usePostReactions(postId: string | undefined) {
  return useQuery({
    queryKey: postId ? qk.postReactions.byPost(postId) : ['postReactions','none'],
    enabled: Boolean(postId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('post_reactions')
        .select('*')
        .eq('post_id', postId!);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useReactToPost() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PostReactionCreateInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = postReactionCreateSchema.parse(input);
      const { data, error } = await supabase
        .from('post_reactions')
        .upsert(
          { post_id: parsed.post_id, actor_id: user.id, kind: parsed.kind },
          { onConflict: 'post_id,actor_id,kind' },
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: qk.postReactions.byPost(vars.post_id) }),
  });
}

export function useUnreactToPost() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, kind }: { postId: string; kind: ReactionKind }) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('post_reactions')
        .delete()
        .eq('post_id', postId)
        .eq('actor_id', user.id)
        .eq('kind', kind);
      if (error) throw error;
      return { postId, kind };
    },
    onSuccess: ({ postId }) => qc.invalidateQueries({ queryKey: qk.postReactions.byPost(postId) }),
  });
}
