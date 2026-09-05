import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <main className="soft-grid min-h-screen bg-[#fdf0d5] text-[#1f2937]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="float-in">
            <div className="mb-4 inline-flex rounded-full border border-[#669bbc]/30 bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#527f9d]">
              PLAN • FOCUS • SUPPORT
            </div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-[#1f2937] md:text-7xl">
              Yappers helps students keep going.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              A calm AI companion for study planning, deep focus, and support when academic pressure gets real.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/login">
                <Button>Get started</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary">Open dashboard</Button>
              </Link>
            </div>
          </div>

          <Card className="float-in-delay relative overflow-hidden p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#527f9d]">Today</p>
                <h2 className="mt-2 text-2xl font-black text-[#1f2937]">AI/ML roadmap</h2>
              </div>
              <div className="rounded-full border border-[#669bbc]/30 bg-[#669bbc]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#527f9d]">
                On track
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm text-[#667085]">
              <div className="rounded-2xl border border-[#ffc8dd]/50 bg-[#ffc8dd]/30 p-4">
                <div className="font-semibold">This week</div>
                <div className="mt-2 font-bold text-[#1f2937]">Learn Python fundamentals + linear algebra basics</div>
              </div>
              <div className="rounded-2xl border border-[#669bbc]/20 bg-[#669bbc]/10 p-4">
                <div className="font-semibold">Focus session</div>
                <div className="mt-2 font-bold text-[#1f2937]">45 minutes · Camera-enabled · Keep the streak alive</div>
              </div>
              <div className="rounded-2xl border border-[#669bbc]/20 bg-white/70 p-4">
                <div className="font-semibold">Support</div>
                <div className="mt-2 font-bold text-[#1f2937]">Break the workload into one small action and continue.</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
