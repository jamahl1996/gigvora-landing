import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import { eventUpsertSchema, type EventUpsertInput } from '@/lib/schemas/extras';

export function useUpcomingEvents() {
  return useQuery({
    queryKey: qk.events.upcoming,
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*')
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useMyEvents() {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.events.mine,
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*').eq('host_id', user!.id);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateEvent() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: EventUpsertInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      const parsed = eventUpsertSchema.parse(input);
      const { data, error } = await supabase.from('events').insert({
        host_id: user.id,
        title: parsed.title,
        description: parsed.description,
        starts_at: parsed.starts_at,
        ends_at: parsed.ends_at ?? null,
        location: parsed.location ?? null,
        online_url: parsed.online_url ?? null,
        capacity: parsed.capacity ?? null,
        visibility: parsed.visibility,
        cover_image_url: parsed.cover_image_url ?? null,
        group_id: parsed.group_id ?? null,
        organization_id: parsed.organization_id ?? null,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.events.upcoming });
      qc.invalidateQueries({ queryKey: qk.events.mine });
    },
  });
}