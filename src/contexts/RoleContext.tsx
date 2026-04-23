import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import {
  UserRole, ROLE_CONFIGS, DashboardTab,
  PlanTier, FeatureEntitlement, PLAN_CONFIGS, ENTITLEMENT_LABELS,
} from '@/types/role';
import { useUserRoles, type AppRole } from '@/hooks/useUserRoles';
import { useAuth } from '@/contexts/AuthContext';

interface RoleContextValue {
  activeRole: UserRole;
  /**
   * Phase 06 — server-checked role switch. Throws if the authenticated user
   * does not actually own the requested role in `user_roles`. Unauthenticated
   * users may still call this with `'user'` (the public default) but cannot
   * elevate to `professional` / `enterprise` / `admin` without a real grant.
   */
  setActiveRole: (role: UserRole) => Promise<void>;
  /** Roles this user is actually allowed to adopt (server-derived). */
  availableRoles: UserRole[];
  dashboardTabs: DashboardTab[];
  // Plan & entitlements
  currentPlan: PlanTier;
  setPlan: (plan: PlanTier) => void;
  entitlements: Set<FeatureEntitlement>;
  hasEntitlement: (feature: FeatureEntitlement) => boolean;
  isSubscribed: (feature: 'recruiter-pro' | 'sales-navigator') => boolean;
  /** Returns the minimum plan needed for a feature, or null if already entitled */
  upgradeNeeded: (feature: FeatureEntitlement) => PlanTier | null;
  /** Role switch history for audit */
  roleSwitchHistory: Array<{ from: UserRole; to: UserRole; at: Date }>;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
};

/**
 * Map server `app_role` values back to the front-end `UserRole` union.
 * Any admin-family role collapses to the single `'admin'` UserRole, which
 * the existing dashboard config already handles.
 */
function appRolesToUserRoles(roles: AppRole[]): UserRole[] {
  const out = new Set<UserRole>(['user']); // everyone may be a 'user'
  for (const r of roles) {
    if (r === 'user' || r === 'professional' || r === 'enterprise') {
      out.add(r);
    } else {
      out.add('admin');
    }
  }
  return Array.from(out);
}

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleRaw] = useState<UserRole>('user');
  const [currentPlan, setPlan] = useState<PlanTier>('free');
  const [roleSwitchHistory, setHistory] = useState<Array<{ from: UserRole; to: UserRole; at: Date }>>([]);
  const { isAuthenticated } = useAuth();
  const { roles: serverRoles } = useUserRoles();

  const availableRoles = useMemo(() => appRolesToUserRoles(serverRoles), [serverRoles]);

  // If the user signs out (or the server reports they no longer hold a role
  // they were viewing), demote the active role back to 'user' so they can't
  // keep seeing pro/enterprise UI off a stale client cache.
  useEffect(() => {
    if (!isAuthenticated) {
      setActiveRoleRaw('user');
      return;
    }
    if (!availableRoles.includes(activeRole)) {
      setActiveRoleRaw('user');
    }
  }, [isAuthenticated, availableRoles, activeRole]);

  const entitlements = useMemo(
    () => new Set(PLAN_CONFIGS[currentPlan].entitlements),
    [currentPlan],
  );

  const setActiveRole = useCallback<RoleContextValue['setActiveRole']>(
    async (role) => {
      // 'user' is always allowed — it is the public default for any
      // authenticated session.
      if (role !== 'user' && !availableRoles.includes(role)) {
        throw new Error(
          `You do not have access to the "${role}" role. Contact an admin to request it.`,
        );
      }
      setActiveRoleRaw((prev) => {
        if (prev !== role) {
          setHistory((h) => [...h.slice(-19), { from: prev, to: role, at: new Date() }]);
        }
        return role;
      });
    },
    [availableRoles],
  );

  const dashboardTabs = ROLE_CONFIGS[activeRole].dashboardTabs;

  const hasEntitlement = useCallback(
    (feature: FeatureEntitlement) => entitlements.has(feature),
    [entitlements],
  );

  const isSubscribed = useCallback(
    (feature: 'recruiter-pro' | 'sales-navigator') => entitlements.has(feature),
    [entitlements],
  );

  const upgradeNeeded = useCallback(
    (feature: FeatureEntitlement): PlanTier | null => {
      if (entitlements.has(feature)) return null;
      return ENTITLEMENT_LABELS[feature]?.minPlan ?? 'pro';
    },
    [entitlements],
  );

  return (
    <RoleContext.Provider
      value={{
        activeRole, setActiveRole, availableRoles, dashboardTabs,
        currentPlan, setPlan, entitlements,
        hasEntitlement, isSubscribed, upgradeNeeded,
        roleSwitchHistory,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};
