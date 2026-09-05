import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`focus-ring w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 transition focus:border-violet-400/60 focus:bg-white/[0.06] ${className}`.trim()}
      {...props}
    />
  );
}
