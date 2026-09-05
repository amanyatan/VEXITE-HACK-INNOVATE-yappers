'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { AnimatedBackground } from './AnimatedBackground';
import { MobileNavigation } from './MobileNavigation';

type AppShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const protectedPaths = ['/dashboard', '/communicate', '/study', '/consultant'];
    if (!user && protectedPaths.includes(pathname)) {
      router.replace('/login');
    }
  }, [pathname, router, user]);

  return (
    <div className="min-h-screen text-zinc-100">
      <AnimatedBackground />
      <TopBar />
      <div className="mx-auto flex max-w-[1440px]">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-8 pb-28 sm:px-8 lg:px-12 lg:pb-12">
          {(title || subtitle) && (
            <div className="mb-8">
              {title && <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>}
              {subtitle && <p className="mt-2 max-w-2xl text-sm text-zinc-500">{subtitle}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
}
