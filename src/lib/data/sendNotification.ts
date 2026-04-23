/**
 * Cross-user notification fan-out helper (B-044).
 * Wraps the SECURITY DEFINER `public.send_notification` RPC so the
 * frontend can post a notification addressed to ANOTHER user without
 * needing the service-role key. The RPC enforces actor=auth.uid()
 * and refuses self-addressed notifications.
 */
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SendNotificationInput {
  userId: string;
  kind: string;
  title: string;
  body?: string | null;
  linkUrl?: string | null;
  payload?: Record<string, unknown>;
  sourceKind?: string | null;
  sourceId?: string | null;
}

export async function sendNotification(input: SendNotificationInput): Promise<string | null> {
  const { data, error } = await (supabase as any).rpc('send_notification', {
    _user_id: input.userId,
    _kind: input.kind,
    _title: input.title,
    _body: input.body ?? null,
    _link_url: input.linkUrl ?? null,
    _payload: input.payload ?? {},
    _source_kind: input.sourceKind ?? null,
    _source_id: input.sourceId ?? null,
  });
  if (error) throw error;
  return (data as string | null) ?? null;
}

export function useSendNotification() {
  return useMutation({ mutationFn: sendNotification });
}