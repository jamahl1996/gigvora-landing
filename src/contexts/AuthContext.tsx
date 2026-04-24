import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthSession {
  accessToken: string;
  createdAt: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const STORAGE_KEY = 'gigvora.auth.session.v1';
const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

function createLocalUser(email: string, name?: string): User {
  let hash = 0;
  for (let i = 0; i < email.length; i += 1) {
    hash = (hash * 31 + email.charCodeAt(i)) | 0;
  }

  return {
    id: `local-${Math.abs(hash)}`,
    email,
    name: name?.trim() || email.split('@')[0] || 'User',
  };
}

function createLocalSession(user: User): AuthSession {
  return {
    accessToken: `local-${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
    user,
  };
}

function readStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    return parsed?.user?.email ? parsed : null;
  } catch {
    return null;
  }
}

function writeStoredSession(session: AuthSession | null) {
  if (typeof window === 'undefined') return;
  if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(STORAGE_KEY);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedSession = readStoredSession();
    setSession(storedSession);
    setUser(storedSession?.user ?? null);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error('Email and password required');

    const nextSession = createLocalSession(createLocalUser(email));
    writeStoredSession(nextSession);
    setSession(nextSession);
    setUser(nextSession.user);
  };

  const logout = async () => {
    writeStoredSession(null);
    setUser(null);
    setSession(null);
  };

  const signup = async (email: string, password: string, name: string) => {
    if (!email || !password) throw new Error('Email and password required');

    const nextSession = createLocalSession(createLocalUser(email, name));
    writeStoredSession(nextSession);
    setSession(nextSession);
    setUser(nextSession.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!session,
        isLoading,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
