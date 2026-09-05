'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  ['⌂', 'Home', '/dashboard'],
  ['◌', 'Talk', '/communicate'],
  ['◷', 'Study', '/study'],
  ['✦', 'Mentor', '/consultant'],
];

export function MobileNavigation() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-4 bottom-4 z-30 grid grid-cols-4 rounded-2xl border border-white/10 bg-[#101010]/90 p-2 shadow-2xl backdrop-blur-xl lg:hidden">
      {items.map(([icon, label, href]) => {
        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
        return <Link key={href} href={href} className={`focus-ring flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] transition ${active ? 'bg-violet-500/15 text-violet-300' : 'text-zinc-500 hover:text-zinc-200'}`}><span className="text-base">{icon}</span>{label}</Link>;
      })}
    </nav>
  );
}
