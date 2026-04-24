import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { qk } from '@/lib/queryKeys';
import type { Tables } from '@/integrations/supabase/types';

export type AuditLogRow = any;

/**
 * Recent audit-log entries. RLS restricts visibility to super-admin,
 * compliance, and trust-safety roles — non-privileged callers get [].
 */
export function useRecentAuditLogs(limit = 100) {
  const { user } = useAuth();
  return useQuery({
    queryKey: qk.auditLogs.recent(limit),
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<AuditLogRow[]> => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Audit trail for a specific record (target_table + target_id). */
export function useAuditLogsForTarget(table: string | null, id: string | null) {
  return useQuery({
    queryKey: table && id ? qk.auditLogs.forTarget(table, id) : ['auditLogs', 'forTarget', 'none'],
    enabled: Boolean(table && id),
    queryFn: async (): Promise<AuditLogRow[]> => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('target_table', table!)
        .eq('target_id', id!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}
