import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseClass = 'focus-ring inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 hover:-translate-y-0.5';
  const variantClass =
    variant === 'secondary'
      ? 'border border-white/10 bg-white/[0.04] text-zinc-200 hover:border-violet-400/50 hover:bg-violet-500/10'
      : variant === 'ghost'
        ? 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white'
        : 'bg-violet-600 text-white shadow-lg shadow-violet-950/40 hover:bg-violet-500';

  return <button className={`${baseClass} ${variantClass} ${className}`.trim()} {...props} />;
}
