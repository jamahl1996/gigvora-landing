import React, { useState } from 'react';
import { Link, useNavigate } from '@/components/tanstack/RouterLink';
import { Button } from '@/components/ui/button';
import { AuthShell } from '@/components/auth/AuthShell';
import { useAuth } from '@/contexts/AuthContext';
import { lovable } from '@/integrations/lovable/index';
import { toast } from 'sonner';
import { ArrowRight, Eye, EyeOff, AlertTriangle, Loader2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/feed');
    } catch (err: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) {
        navigate('/account-locked');
        return;
      }
      const msg = err.message || 'Invalid email or password';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="rounded-3xl border bg-card p-7 shadow-elevated">
        <div className="text-center mb-6">
          <img src="/favicon.ico" alt="Gigvora" className="h-10 w-10 mx-auto mb-3 rounded-xl" />
          <h1 className="text-xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-xs text-muted-foreground mt-1">Sign in to your Gigvora account</p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-[hsl(var(--state-blocked)/0.08)] border border-[hsl(var(--state-blocked)/0.15)] px-3.5 py-2.5 mb-5">
            <AlertTriangle className="h-4 w-4 text-[hsl(var(--state-blocked))] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-[hsl(var(--state-blocked))] font-medium block">{error}</span>
              {attempts >= 3 && (
                <span className="text-[10px] text-[hsl(var(--state-blocked)/0.7)] mt-0.5 block">
                  {5 - attempts} attempt(s) remaining before account lock.
                </span>
              )}
            </div>
          </div>
        )}

        {/* Google button */}
        <Button variant="outline" className="w-full h-10 text-xs gap-2.5 font-medium mb-4 rounded-xl hover:-translate-y-px transition-all duration-200" onClick={async () => {
          const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: window.location.origin });
          if (result.error) { toast.error('Google sign-in failed'); return; }
          if (result.redirected) return;
          navigate('/feed');
        }}>
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </Button>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center"><span className="bg-card px-3 text-[10px] text-muted-foreground">or sign in with email</span></div>
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
              <Link to="/forgot-password" className="text-[11px] text-[hsl(var(--gigvora-blue))] hover:underline font-medium">Forgot password?</Link>
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

          {/* Remember me */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="h-3.5 w-3.5 rounded border accent-[hsl(var(--gigvora-blue))]" defaultChecked />
            <span className="text-[11px] text-muted-foreground">Keep me signed in</span>
          </label>

          <Button type="submit" className="w-full h-10 text-sm gap-2 font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-px transition-all duration-200" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-5">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[hsl(var(--gigvora-blue))] font-semibold hover:underline">Create account</Link>
        </p>
      </div>

      {/* Session trust indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-muted-foreground/40">
        <Shield className="h-3 w-3" />
        <span>Secure session — your data never leaves our encrypted network</span>
      </div>
    </AuthShell>
  );
};

export default SignInPage;
