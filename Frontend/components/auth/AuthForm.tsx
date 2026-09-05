'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

type AuthFormProps = {
  mode: 'login' | 'signup';
  onSubmit: (payload: { email: string; password: string; fullName?: string }) => Promise<void> | void;
};

function getAuthErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  const normalized = message.toLowerCase();

  if (normalized.includes('email not confirmed')) {
    return 'Your email is not confirmed yet. Open the confirmation link in your inbox, then try again.';
  }

  if (normalized.includes('invalid login credentials')) {
    return 'Email or password is incorrect. Check both fields and try again.';
  }

  if (normalized.includes('user already registered')) {
    return 'This email already has an account. Use Log in instead.';
  }

  return message || 'Something went wrong. Please try again.';
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <Card className="mx-auto w-full max-w-md p-7 sm:p-9">
      <div className="mb-7">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 text-xl font-black text-white shadow-lg shadow-violet-950/50">Y</div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Yappers · Your study companion</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          {mode === 'login' ? 'Pick up your plan, focus, and momentum.' : 'Build a calmer way to learn, one small step at a time.'}
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setError('');
          setLoading(true);
          try {
            await onSubmit({ email, password, fullName: fullName || undefined });
          } catch (submitError) {
            setError(getAuthErrorMessage(submitError));
          } finally {
            setLoading(false);
          }
        }}
      >
        {mode === 'signup' && (
          <label className="block text-sm font-semibold text-zinc-300">
            Full name
            <div className="mt-1.5">
              <Input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Arya Sharma" />
            </div>
          </label>
        )}

        <label className="block text-sm font-semibold text-zinc-300">
          Email
          <div className="mt-1.5">
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
          </div>
        </label>

        <label className="block text-sm font-semibold text-zinc-300">
          Password
          <div className="mt-1.5">
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </div>
        </label>

        {error && (
          <div role="alert" className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm leading-5 text-rose-200">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full py-3.5" disabled={loading}>
          {loading ? 'One moment...' : mode === 'login' ? 'Log in to Yappers' : 'Create account'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-500">
        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
        <Link href={mode === 'login' ? '/signup' : '/login'} className="font-bold text-violet-300 underline decoration-violet-400/50 decoration-2 underline-offset-4 hover:text-white">
          {mode === 'login' ? 'Sign up free' : 'Log in'}
        </Link>
      </p>
    </Card>
  );
}
