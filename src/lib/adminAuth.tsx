import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type AdminRole =
  | 'super-admin'
  | 'cs-admin'
  | 'finance-admin'
  | 'moderator'
  | 'trust-safety'
  | 'dispute-mgr'
  | 'ads-ops'
  | 'compliance'
  | 'marketing-admin';

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: AdminRole;
  isSuperAdmin: boolean;
  env: 'production' | 'staging' | 'sandbox';
  loggedInAt: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  activeRole: AdminRole;
  login: (input: { email: string; password: string; role: AdminRole; env: AdminUser['env'] }) => Promise<AdminUser>;
  logout: () => void;
  switchRole: (role: AdminRole) => Promise<void>;
}

const STORAGE_KEY = 'gigvora.admin.session.v1';
const AdminAuthContext = createContext<AdminAuthState | null>(null);

function readSession(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminUser;
    return parsed?.id && parsed?.role ? parsed : null;
  } catch {
    return null;
  }
}

function writeSession(user: AdminUser | null) {
  if (typeof window === 'undefined') return;
  if (user) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else window.sessionStorage.removeItem(STORAGE_KEY);
}

function localId(email: string) {
  let hash = 0;
  for (let i = 0; i < email.length; i += 1) {
    hash = (hash * 31 + email.charCodeAt(i)) | 0;
  }
  return `admin-${Math.abs(hash)}`;
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => readSession());
  const [activeRole, setActiveRoleState] = useState<AdminRole>(() => readSession()?.role ?? 'super-admin');

  const login = useCallback<AdminAuthState['login']>(async ({ email, password, role, env }) => {
    if (!email || !password) throw new Error('Email and password required.');

    const next: AdminUser = {
      id: localId(email),
      email,
      displayName: email.split('@')[0],
      role,
      isSuperAdmin: role === 'super-admin',
      env,
      loggedInAt: new Date().toISOString(),
    };
    writeSession(next);
    setUser(next);
    setActiveRoleState(role);
    return next;
  }, []);

  const logout = useCallback(() => {
    writeSession(null);
    setUser(null);
  }, []);

  const switchRole = useCallback<AdminAuthState['switchRole']>(
    async (role) => {
      if (!user) throw new Error('Not authenticated.');
      if (!user.isSuperAdmin) throw new Error('Only Super Admins can switch role context.');
      setActiveRoleState(role);
    },
    [user],
  );

  const value = useMemo<AdminAuthState>(
    () => ({
      user,
      isAuthenticated: !!user,
      activeRole,
      login,
      logout,
      switchRole,
    }),
    [user, activeRole, login, logout, switchRole],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export function useAdminAuth(): AdminAuthState {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within <AdminAuthProvider>.');
  return ctx;
}
