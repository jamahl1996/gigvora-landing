import { useCallback, useEffect, useState } from 'react';
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
  const { isAuthenticated } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setRoles(isAuthenticated ? ['user'] : []);
    setIsLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const hasRole = useCallback((role: AppRole) => roles.includes(role), [roles]);
  const hasAnyRole = useCallback(
    (wanted: AppRole[]) => wanted.some((role) => roles.includes(role)),
    [roles],
  );

  return {
    roles,
    isLoading,
    error,
    hasRole,
    hasAnyRole,
    isAdmin: roles.some((role) => ADMIN_ROLES.includes(role)),
    refresh,
  };
}
