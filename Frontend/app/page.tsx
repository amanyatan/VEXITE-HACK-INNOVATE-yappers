import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AnimatedRoadmapCards } from '@/components/dashboard/AnimatedRoadmapCards';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_40%,rgba(72,0,255,0.16),transparent_34%),linear-gradient(90deg,rgba(5,5,5,0.96)_0%,rgba(5,5,5,0.88)_48%,rgba(5,5,5,0.96)_100%)]" />
      <div className="ambient-grid pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col justify-center px-5 py-12 sm:px-8 lg:px-12">
        <nav className="absolute inset-x-5 top-6 flex items-center justify-between sm:inset-x-8 lg:inset-x-12" aria-label="Landing navigation">
          <Link href="/" className="focus-ring flex items-center gap-3 text-sm font-semibold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-950/50">Y</span>
            Yappers
          </Link>
          <Link href="/login" className="focus-ring rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-zinc-300 backdrop-blur-md transition hover:border-violet-400/50 hover:text-white">
            Sign in
          </Link>
        </nav>

        <div className="grid items-center gap-12 pt-16 lg:grid-cols-[1.08fr_.92fr] lg:gap-20">
          <section className="max-w-3xl">
            <div className="mb-6 inline-flex rounded-full border border-violet-300/25 bg-violet-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-200 backdrop-blur-md">
              PLAN · FOCUS · SUPPORT
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-7xl">
              Keep going, even when learning feels heavy.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
              Yappers is a calm AI companion for study planning, deep focus, and the next small step when academic pressure gets real.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup"><Button>Start learning with Yappers</Button></Link>
              <Link href="/dashboard"><Button variant="secondary">Open dashboard</Button></Link>
            </div>
          </section>

          <Card className="flex min-h-[390px] items-center justify-center border-white/15 bg-[#0a0a0a]/75 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
            <AnimatedRoadmapCards />
          </Card>
        </div>
      </div>
    </main>
  );
}
