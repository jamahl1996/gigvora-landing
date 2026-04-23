import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import { webinarUpsertSchema, type WebinarUpsertInput } from '@/lib/schemas/extras';

export function useUpcomingWebinars() {
  return useQuery({
    queryKey: qk.webinars.upcoming,
    queryFn: async () => {
      const { data, error } = await supabase.from('webinars').select('*')
        .gte('starts_at', new Date().toISOString())
        .eq('status', 'scheduled')
        .order('starts_at', { ascending: true })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useMyWebinars() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.webinars.mine,
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase.from('webinars').select('*')
        .eq('host_id', user!.id).order('starts_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateWebinar() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: WebinarUpsertInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = webinarUpsertSchema.parse(input);
      const { data, error } = await supabase.from('webinars').insert({
        host_id: user.id,
        title: parsed.title,
        slug: parsed.slug ?? null,
        description: parsed.description,
        starts_at: parsed.starts_at,
        ends_at: parsed.ends_at ?? null,
        capacity: parsed.capacity ?? null,
        meeting_url: parsed.meeting_url ?? null,
        cover_image_url: parsed.cover_image_url ?? null,
        visibility: parsed.visibility,
        organization_id: parsed.organization_id ?? null,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.webinars.upcoming });
      qc.invalidateQueries({ queryKey: qk.webinars.mine });
    },
  });
}