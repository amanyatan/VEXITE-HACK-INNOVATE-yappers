'use client';

import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { AnimatedBackground } from '@/components/layout/AnimatedBackground';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 text-zinc-100">
      <AnimatedBackground />
      <div className="relative w-full max-w-lg">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-zinc-500">PLAN · FOCUS · SUPPORT</p>
        </div>
        <AuthForm
          mode="login"
          onSubmit={async ({ email, password }) => {
            await signIn({ email, password });
            router.push('/dashboard');
          }}
        />
      </div>
    </main>
  );
}
