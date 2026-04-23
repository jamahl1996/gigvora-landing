/**
 * AdminAuth — server-enforced admin identity for the /admin terminal.
 *
 * Phase 06 rewrite. Replaces the previous "any email/password works + pick
 * super-admin from a dropdown" privilege escalation (B-025) with a real
 * gate that requires:
 *   1. A real Lovable Cloud auth session (`supabase.auth.signInWithPassword`)
 *   2. A real `user_roles` row matching the requested role, verified by
 *      the `has_role()` SECURITY DEFINER function on the server.
 *
 * Session cache stays in sessionStorage (tabs auto-expire on close) but is
 * now derived from the verified Supabase session — never trusted on its own.
 * If the underlying Supabase session ends, the admin session is dropped too.
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  /** True only for super-admin — gates role switching, kill-switches, role assignment. */
  isSuperAdmin: boolean;
  env: 'production' | 'staging' | 'sandbox';
  loggedInAt: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  /** Role being viewed. Equals user.role unless super-admin has impersonated another role. */
  activeRole: AdminRole;
  login: (input: { email: string; password: string; role: AdminRole; env: AdminUser['env'] }) => Promise<AdminUser>;
  logout: () => void;
  /** Throws if not super-admin OR if the server rejects the requested role. */
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
    if (!parsed?.id || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(user: AdminUser | null) {
  if (typeof window === 'undefined') return;
  if (user) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else window.sessionStorage.removeItem(STORAGE_KEY);
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => readSession());
  const [activeRole, setActiveRoleState] = useState<AdminRole>(() => readSession()?.role ?? 'super-admin');

  // Re-sync if another tab logs out.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const next = readSession();
        setUser(next);
        if (next) setActiveRoleState(next.role);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // If the underlying Supabase session ends, drop the cached admin session.
  // Prevents a logged-out user from keeping admin access via stale storage.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        writeSession(null);
        setUser(null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = useCallback<AdminAuthState['login']>(async ({ email, password, role, env }) => {
    if (!email || !password) throw new Error('Email and password required.');

    // 1. Real Supabase auth — wrong credentials throw here.
    const { data: signIn, error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInErr || !signIn.user) {
      throw new Error(signInErr?.message ?? 'Invalid credentials.');
    }

    // 2. Server-checked role authorisation. The front end CANNOT decide on
    //    its own that this person is a super-admin — we ask Postgres via the
    //    has_role() SECURITY DEFINER function created in the Phase 06 migration.
    const rpcClient = supabase as unknown as {
      rpc: (
        fn: string,
        args: Record<string, unknown>,
      ) => Promise<{ data: boolean | null; error: { message: string } | null }>;
    };
    const { data: hasRoleData, error: hasRoleErr } = await rpcClient.rpc('has_role', {
      _user_id: signIn.user.id,
      _role: role,
    });
    if (hasRoleErr) {
      // Sign back out so we don't leave a half-authenticated user behind.
      await supabase.auth.signOut();
      throw new Error('Could not verify admin role: ' + hasRoleErr.message);
    }
    if (!hasRoleData) {
      await supabase.auth.signOut();
      throw new Error(`This account does not have the "${role}" admin role.`);
    }

    const next: AdminUser = {
      id: signIn.user.id,
      email: signIn.user.email ?? email,
      displayName:
        (signIn.user.user_metadata?.full_name as string | undefined) ?? email.split('@')[0],
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
    // Best-effort: also end the underlying Supabase session.
    void supabase.auth.signOut();
  }, []);

  const switchRole = useCallback<AdminAuthState['switchRole']>(
    async (role) => {
      if (!user) throw new Error('Not authenticated.');
      if (!user.isSuperAdmin) {
        throw new Error('Only Super Admins can switch role context.');
      }
      // Re-verify against the server even for super-admins — defends against
      // a tampered front-end role list.
      const rpcClient = supabase as unknown as {
        rpc: (
          fn: string,
          args: Record<string, unknown>,
        ) => Promise<{ data: boolean | null; error: { message: string } | null }>;
      };
      const { data, error: rpcErr } = await rpcClient.rpc('has_role', {
        _user_id: user.id,
        _role: role,
      });
      if (rpcErr) throw new Error('Role check failed: ' + rpcErr.message);
      if (!data) throw new Error(`Server denied role "${role}" for this account.`);
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
