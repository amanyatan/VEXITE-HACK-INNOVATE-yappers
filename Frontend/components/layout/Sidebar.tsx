'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: '⌂' },
  { href: '/communicate', label: 'Communicate', icon: '◌' },
  { href: '/study', label: 'Study room', icon: '◷' },
  { href: '/consultant', label: 'Support', icon: '✦' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-[calc(100vh-65px)] w-64 shrink-0 border-r border-white/[0.07] bg-black/20 p-6 lg:block">
      <div className="mb-12 flex items-center gap-3">
        <div className="pulse-ring flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg font-black text-white">Y</div>
        <div>
          <div className="text-lg font-semibold text-white">Yappers</div>
          <div className="text-xs text-zinc-600">Your second brain</div>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                active ? 'bg-violet-500/15 text-violet-200' : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200'
              }`}
            >
              <span className="w-5 text-center text-base">{item.icon}</span>{item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
