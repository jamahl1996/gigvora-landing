import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from '@/components/tanstack/RouterLink';
import { Button } from '@/components/ui/button';
import { AuthShell } from '@/components/auth/AuthShell';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowRight, Eye, EyeOff, AlertTriangle, Loader2, Shield } from 'lucide-react';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const { login, signInWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.error) {
        // Check live lockout status to surface remaining attempts
        const { data } = await (supabase as any).rpc('check_account_lockout', { _email: email });
        const row = Array.isArray(data) ? data[0] : data;
        if (row?.locked) {
          navigate('/auth/account-locked');
          return;
        }
        const remaining = typeof row?.attempts_remaining === 'number' ? row.attempts_remaining : null;
        setAttemptsRemaining(remaining);
        setError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success('Welcome back');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="rounded-3xl border bg-card p-7 shadow-lg">
        <div className="text-center mb-6">
          <img src="/favicon.ico" alt="Gigvora" className="h-10 w-10 mx-auto mb-3 rounded-xl" />
          <h1 className="text-xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-xs text-muted-foreground mt-1">Sign in to your Gigvora account</p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-destructive/10 border border-destructive/20 px-3.5 py-2.5 mb-5">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-destructive font-medium block">{error}</span>
              {attemptsRemaining !== null && attemptsRemaining <= 2 && attemptsRemaining > 0 && (
                <span className="text-[10px] text-destructive/70 mt-0.5 block">
                  {attemptsRemaining} attempt{attemptsRemaining === 1 ? '' : 's'} remaining before lockout.
                </span>
              )}
            </div>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full h-10 text-sm gap-2 font-medium rounded-xl mb-4"
          onClick={() => signInWithGoogle()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
          <div className="relative flex justify-center"><span className="bg-card px-2 text-[10px] text-muted-foreground">or with email</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium mb-1.5 block">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full h-10 rounded-xl border bg-background px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-medium">Password</label>
              <Link to="/auth/forgot-password" className="text-[11px] text-primary hover:underline font-medium">Forgot password?</Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full h-10 rounded-xl border bg-background px-3.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-10 text-sm gap-2 font-semibold rounded-xl" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-5">
          Don't have an account?{' '}
          <Link to="/auth/sign-up" className="text-primary font-semibold hover:underline">Create account</Link>
        </p>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-muted-foreground/60">
        <Shield className="h-3 w-3" />
        <span>Secure session — encrypted in transit and at rest</span>
      </div>
    </AuthShell>
  );
};

export default SignInPage;
