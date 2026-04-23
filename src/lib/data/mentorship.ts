import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import {
  mentorshipCreateSchema, mentorshipUpdateSchema,
  type MentorshipCreateInput, type MentorshipUpdateInput,
} from '@/lib/schemas/extras';

export function useAsMentor() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.mentorship.asMentor,
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase.from('mentorship_relationships').select('*')
        .eq('mentor_id', user!.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAsMentee() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.mentorship.asMentee,
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase.from('mentorship_relationships').select('*')
        .eq('mentee_id', user!.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useRequestMentorship() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: MentorshipCreateInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = mentorshipCreateSchema.parse(input);
      const { data, error } = await supabase.from('mentorship_relationships').insert({
        mentor_id: parsed.mentor_id,
        mentee_id: user.id,
        goals: parsed.goals,
        cadence: parsed.cadence ?? null,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mentorship'] }),
  });
}

export function useUpdateMentorship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: string; patch: MentorshipUpdateInput }) => {
      const parsed = mentorshipUpdateSchema.parse(args.patch);
      const { data, error } = await supabase.from('mentorship_relationships').update(parsed)
        .eq('id', args.id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mentorship'] }),
  });
}