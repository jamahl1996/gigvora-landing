import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import {
  postCommentCreateSchema,
  postCommentUpdateSchema,
  type PostCommentCreateInput,
} from '@/lib/schemas/social';

export function usePostComments(postId: string | undefined) {
  return useQuery({
    queryKey: postId ? qk.postComments.byPost(postId) : ['postComments','none'],
    enabled: Boolean(postId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', postId!)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreatePostComment() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PostCommentCreateInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = postCommentCreateSchema.parse(input);
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: parsed.post_id,
          parent_id: parsed.parent_id ?? null,
          author_id: user.id,
          body: parsed.body,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: qk.postComments.byPost(vars.post_id) }),
  });
}

export function useUpdatePostComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; body: string }) => {
      const parsed = postCommentUpdateSchema.parse(input);
      const { data, error } = await supabase
        .from('post_comments')
        .update({ body: parsed.body })
        .eq('id', parsed.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.post_id) qc.invalidateQueries({ queryKey: qk.postComments.byPost(data.post_id) });
    },
  });
}

export function useDeletePostComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, postId }: { id: string; postId: string }) => {
      // Soft delete via deleted_at; RLS allows author/moderator
      const { error } = await supabase
        .from('post_comments')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return { id, postId };
    },
    onSuccess: ({ postId }) => qc.invalidateQueries({ queryKey: qk.postComments.byPost(postId) }),
  });
}
