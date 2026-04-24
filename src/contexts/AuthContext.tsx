import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string; needsVerification?: boolean }>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

async function recordAudit(userId: string | null, email: string | null, eventType: string, metadata: Record<string, unknown> = {}) {
  try {
    await (supabase as any).from('auth_audit_log').insert({
      user_id: userId,
      email,
      event_type: eventType,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      metadata,
    });
  } catch {
    /* non-fatal */
  }
}

async function recordAttempt(email: string, success: boolean, reason?: string) {
  try {
    await (supabase as any).rpc('record_login_attempt', {
      _email: email,
      _success: success,
      _ua: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      _reason: reason ?? null,
    });
  } catch {
    /* non-fatal */
  }
}

async function checkLockout(email: string) {
  try {
    const { data } = await (supabase as any).rpc('check_account_lockout', { _email: email });
    const row = Array.isArray(data) ? data[0] : data;
    return {
      locked: !!row?.locked,
      lockedUntil: row?.locked_until ? new Date(row.locked_until) : null,
      attemptsRemaining: typeof row?.attempts_remaining === 'number' ? row.attempts_remaining : 5,
    };
  } catch {
    return { locked: false, lockedUntil: null, attemptsRemaining: 5 };
  }
}

async function registerDeviceSession(userId: string) {
  try {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
    let browser = 'Unknown';
    if (/Chrome\//.test(ua) && !/Edg|OPR/.test(ua)) browser = 'Chrome';
    else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
    else if (/Firefox\//.test(ua)) browser = 'Firefox';
    else if (/Edg\//.test(ua)) browser = 'Edge';
    let os = 'Unknown';
    if (/Windows/.test(ua)) os = 'Windows';
    else if (/Mac OS X/.test(ua)) os = 'macOS';
    else if (/Android/.test(ua)) os = 'Android';
    else if (/iPhone|iPad/.test(ua)) os = 'iOS';
    else if (/Linux/.test(ua)) os = 'Linux';

    await (supabase as any).from('device_sessions').insert({
      user_id: userId,
      device_type: isMobile ? 'mobile' : 'desktop',
      browser,
      os,
      device_name: `${browser} on ${os}`,
    });
  } catch {
    /* non-fatal */
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up listener BEFORE getSession (per Supabase guidance)
    const { data: sub } = supabase.auth.onAuthStateChange((event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (event === 'SIGNED_IN' && sess?.user) {
        // Defer non-critical writes
        setTimeout(() => {
          registerDeviceSession(sess.user.id);
          recordAudit(sess.user.id, sess.user.email ?? null, 'sign_in');
        }, 0);
      }
      if (event === 'SIGNED_OUT') {
        recordAudit(null, null, 'sign_out');
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const lock = await checkLockout(email);
    if (lock.locked) {
      return { error: 'Account temporarily locked. Try again later.' };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      await recordAttempt(email, false, error.message);
      return { error: error.message };
    }
    await recordAttempt(email, true);
    return {};
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const redirectTo = `${window.location.origin}/auth/verify`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: { display_name: name, full_name: name },
      },
    });
    if (error) return { error: error.message };
    await recordAudit(data.user?.id ?? null, email, 'sign_up');
    const needsVerification = !data.session;
    return { needsVerification };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) return { error: error.message };
    await recordAudit(null, email, 'password_reset_requested');
    return {};
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    await recordAudit(user?.id ?? null, user?.email ?? null, 'password_changed');
    return {};
  }, [user]);

  const refreshSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setUser(data.session?.user ?? null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!session,
        isLoading,
        login,
        signup,
        signInWithGoogle,
        logout,
        sendPasswordReset,
        updatePassword,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
