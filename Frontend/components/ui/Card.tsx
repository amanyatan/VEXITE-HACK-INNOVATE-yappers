import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return <div className={`rounded-2xl border border-white/[0.08] bg-[#101010]/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl ${className}`.trim()}>{children}</div>;
}
