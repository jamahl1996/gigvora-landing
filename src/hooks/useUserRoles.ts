/**
 * Phase 06 — useUserRoles
 *
 * Fetches the authoritative list of `app_role` values granted to the
 * currently-authenticated user via the `current_user_roles()` Postgres
 * function (SECURITY DEFINER, bypasses RLS recursion).
 *
 * This hook is the single source of truth the front-end uses to ask
 * "may this user actually adopt role X?" — replacing the previous
 * client-only RoleContext.setActiveRole() with a server-checked answer.
 */
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AppRole =
  | 'user'
  | 'professional'
  | 'enterprise'
  | 'super-admin'
  | 'cs-admin'
  | 'finance-admin'
  | 'moderator'
  | 'trust-safety'
  | 'dispute-mgr'
  | 'ads-ops'
  | 'compliance'
  | 'marketing-admin';

export const ADMIN_ROLES: ReadonlyArray<AppRole> = [
  'super-admin',
  'cs-admin',
  'finance-admin',
  'moderator',
  'trust-safety',
  'dispute-mgr',
  'ads-ops',
  'compliance',
  'marketing-admin',
];

export const PLATFORM_ROLES: ReadonlyArray<AppRole> = [
  'user',
  'professional',
  'enterprise',
];

interface UseUserRolesResult {
  roles: AppRole[];
  isLoading: boolean;
  error: Error | null;
  hasRole: (role: AppRole) => boolean;
  hasAnyRole: (roles: AppRole[]) => boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
}

export function useUserRoles(): UseUserRolesResult {
  const { isAuthenticated, user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoles = useCallback(async () => {
    if (!isAuthenticated) {
      setRoles([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // current_user_roles() reads auth.uid() server-side → safe.
      // Cast through unknown because the table type-graph is empty in
      // types.ts (this project only stores DailyMint demo tables) but
      // the RPC was created in the Phase 06 migration.
      const { data, error: rpcError } = await (supabase as unknown as {
        rpc: (fn: string) => Promise<{ data: AppRole[] | null; error: Error | null }>;
      }).rpc('current_user_roles');
      if (rpcError) throw rpcError;
      setRoles(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    void fetchRoles();
  }, [fetchRoles]);

  const hasRole = useCallback((role: AppRole) => roles.includes(role), [roles]);
  const hasAnyRole = useCallback(
    (wanted: AppRole[]) => wanted.some((r) => roles.includes(r)),
    [roles],
  );

  return {
    roles,
    isLoading,
    error,
    hasRole,
    hasAnyRole,
    isAdmin: roles.some((r) => ADMIN_ROLES.includes(r)),
    refresh: fetchRoles,
  };
}