'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { AnimatedBackground } from '@/components/layout/AnimatedBackground';

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [confirmationEmail, setConfirmationEmail] = useState('');

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 text-zinc-100">
      <AnimatedBackground />
      <div className="relative w-full max-w-lg">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold tracking-[0.12em] text-zinc-500">A better study rhythm starts here</p>
        </div>
        <AuthForm
          mode="signup"
          onSubmit={async ({ email, password, fullName }) => {
            const result = await signUp({ email, password, fullName: fullName || 'Student' });
            if (result.requiresEmailConfirmation) {
              setConfirmationEmail(result.user.email);
              return;
            }

            router.push('/dashboard');
          }}
        />
        {confirmationEmail && (
          <div className="mt-4 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4 text-sm leading-6 text-violet-100">
            <strong>Check your inbox.</strong> We sent a confirmation link to {confirmationEmail}. Confirm it first, then use the login page.
          </div>
        )}
      </div>
    </main>
  );
}
