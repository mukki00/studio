'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Already logged in → go straight to todo
  useEffect(() => {
    if (!loading && user) router.replace('/todo');
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/todo');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('Login failed. Check your Firebase configuration.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen hero-wave-bg flex items-center justify-center px-4 overflow-hidden">

      {/* Ambient gradient orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute top-[-10%] left-[-5%] w-[45%] h-[60%] rounded-full"
        style={{ background: 'radial-gradient(circle, hsl(230 85% 56% / 0.10) 0%, transparent 70%)', animation: 'drift-orb-1 25s ease-in-out infinite' }} />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[-10%] right-[-5%] w-[40%] h-[55%] rounded-full"
        style={{ background: 'radial-gradient(circle, hsl(262 72% 56% / 0.08) 0%, transparent 70%)', animation: 'drift-orb-2 30s ease-in-out infinite' }} />

      {/* Card */}
      <div className="glass-card rounded-2xl w-full max-w-md p-8 sm:p-10 relative z-10">

        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8">
          {/* App icon */}
          <div className="w-14 h-14 rounded-2xl border border-primary/20 mb-4 flex items-center justify-center bg-primary/10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className="font-headline text-2xl font-extrabold" style={{
            background: 'linear-gradient(135deg, hsl(230 85% 56%) 0%, hsl(262 72% 62%) 90%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Welcome Back
          </h1>
          <p className="text-sm text-foreground/55 mt-1">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground/75 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-accent" /> Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 border-accent/20 focus:border-accent/50"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground/75 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-accent" /> Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/50 border-accent/20 focus:border-accent/50"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          >
            {submitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…</>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
