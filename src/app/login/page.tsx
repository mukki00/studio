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

      {/* Dome of the Rock silhouette */}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: 'min(420px, 80vw)', opacity: 0.07 }}>
        <svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg" className="w-full" fill="currentColor">
          <rect x="10" y="205" width="460" height="15" rx="3"/>
          <rect x="40" y="186" width="400" height="19" rx="2"/>
          <polygon points="55,186 425,186 405,138 75,138"/>
          <rect x="168" y="86" width="144" height="52" rx="5"/>
          <path d="M153,86 Q240,-35 327,86 Z"/>
          <rect x="237" y="-35" width="6" height="32" rx="2"/>
          <path d="M232,-35 A13,13 0 0,1 250,-35 A9,9 0 0,0 232,-35 Z"/>
          <rect x="57" y="103" width="22" height="83" rx="3"/>
          <rect x="51" y="122" width="34" height="7" rx="1"/>
          <polygon points="57,103 79,103 68,74"/>
          <rect x="401" y="103" width="22" height="83" rx="3"/>
          <rect x="395" y="122" width="34" height="7" rx="1"/>
          <polygon points="401,103 423,103 412,74"/>
        </svg>
      </div>

      {/* Left olive branch */}
      <div aria-hidden="true" className="pointer-events-none absolute left-2 bottom-20 hidden sm:block" style={{ width: '70px', animation: 'olive-sway 7s ease-in-out infinite', transformOrigin: 'bottom center' }}>
        <svg viewBox="0 0 80 170" xmlns="http://www.w3.org/2000/svg" className="w-full opacity-[0.18] text-primary" fill="currentColor">
          <path d="M42,170 Q39,140 34,118 Q28,95 20,70 Q14,50 10,25" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <ellipse cx="30" cy="130" rx="15" ry="6" transform="rotate(-35 30 130)"/>
          <ellipse cx="24" cy="107" rx="13" ry="5.5" transform="rotate(-25 24 107)"/>
          <ellipse cx="19" cy="84" rx="12" ry="5" transform="rotate(-15 19 84)"/>
          <ellipse cx="39" cy="148" rx="11" ry="5" transform="rotate(20 39 148)"/>
        </svg>
      </div>

      {/* Right olive branch (mirrored) */}
      <div aria-hidden="true" className="pointer-events-none absolute right-2 bottom-20 hidden sm:block" style={{ width: '70px', transform: 'scaleX(-1)', animation: 'olive-sway 8s ease-in-out infinite reverse', transformOrigin: 'bottom center' }}>
        <svg viewBox="0 0 80 170" xmlns="http://www.w3.org/2000/svg" className="w-full opacity-[0.18] text-primary" fill="currentColor">
          <path d="M42,170 Q39,140 34,118 Q28,95 20,70 Q14,50 10,25" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <ellipse cx="30" cy="130" rx="15" ry="6" transform="rotate(-35 30 130)"/>
          <ellipse cx="24" cy="107" rx="13" ry="5.5" transform="rotate(-25 24 107)"/>
          <ellipse cx="19" cy="84" rx="12" ry="5" transform="rotate(-15 19 84)"/>
          <ellipse cx="39" cy="148" rx="11" ry="5" transform="rotate(20 39 148)"/>
        </svg>
      </div>

      {/* Floating watermelons */}
      <span aria-hidden="true" className="pointer-events-none select-none absolute left-[6%]  bottom-[22%] text-2xl" style={{ animation: 'float-up-down 5s ease-in-out infinite' }}>🍉</span>
      <span aria-hidden="true" className="pointer-events-none select-none absolute right-[7%] bottom-[30%] text-xl" style={{ animation: 'float-up-down 6s ease-in-out infinite', animationDelay: '1.5s' }}>🍉</span>
      <span aria-hidden="true" className="pointer-events-none select-none absolute left-[15%] top-[12%] text-lg opacity-50" style={{ animation: 'float-up-down 7s ease-in-out infinite', animationDelay: '0.8s' }}>🍉</span>
      <span aria-hidden="true" className="pointer-events-none select-none absolute right-[18%] top-[16%] text-lg opacity-40" style={{ animation: 'float-up-down 5.5s ease-in-out infinite', animationDelay: '2.2s' }}>🍉</span>

      {/* Card */}
      <div className="glass-card rounded-2xl w-full max-w-md p-8 sm:p-10 relative z-10">

        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8">
          {/* Palestinian flag mini */}
          <div className="w-14 h-14 rounded-full border border-accent/20 overflow-hidden mb-4 flex items-center justify-center bg-background/30">
            <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <rect width="200" height="33.33" fill="#000000"/>
              <rect y="33.33" width="200" height="33.34" fill="#FFFFFF"/>
              <rect y="66.67" width="200" height="33.33" fill="#009639"/>
              <polygon points="0,0 90,50 0,100" fill="#CE1126"/>
            </svg>
          </div>
          <h1 className="font-headline text-2xl font-extrabold" style={{
            background: 'linear-gradient(135deg, #009639 0%, hsl(var(--foreground)) 45%, #CE1126 90%)',
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
