'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function TopBar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const hydrated = useSyncExternalStore(() => () => undefined, () => true, () => false);

  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#050505]/70 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-lg font-semibold text-white lg:hidden">
            Yappers
          </Link>
          <div className="hidden rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500 md:block">
            {pathname.replace('/', '') || 'home'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400">
            {hydrated && user ? `Hi, ${user.name || user.email.split('@')[0]}` : 'Guest mode'}
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="focus-ring rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300 transition hover:border-violet-400/60"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
