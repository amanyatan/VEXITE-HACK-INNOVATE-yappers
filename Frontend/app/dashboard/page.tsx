import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { CharacterStage } from '@/components/avatar/CharacterStage';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  return (
    <AppShell title="Good to see you." subtitle="A calm place to make progress, one small step at a time.">
      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <Card className="relative min-h-[390px] overflow-hidden bg-gradient-to-br from-violet-950/40 via-[#101010] to-[#0a0a0a] p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-violet-300">Your learning home</p>
              <h2 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight text-white">Keep the momentum gentle, not perfect.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400">Yappers is here to help you decide what matters now and make the next action feel doable.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/study"><Button>Start a focus session</Button></Link>
              <Link href="/communicate"><Button variant="secondary">Talk it through</Button></Link>
            </div>
          </div>
        </Card>
        <Card className="flex min-h-[390px] items-center justify-center overflow-hidden">
          <CharacterStage caption="Your companion is ready" />
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card><p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Current goal</p><h3 className="mt-4 text-xl font-medium text-white">Finish neural network basics</h3><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[62%] rounded-full bg-violet-500" /></div><p className="mt-3 text-xs text-zinc-500">62% complete · keep going</p></Card>
        <Card><p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Today&apos;s focus</p><h3 className="mt-4 text-xl font-medium text-white">One 45-minute deep work block</h3><p className="mt-3 text-sm text-zinc-500">Camera-supported focus, with permission.</p></Card>
        <Card className="border-violet-400/20 bg-violet-500/[0.07]"><p className="text-xs uppercase tracking-[0.2em] text-violet-300">A thought for you</p><p className="mt-4 text-lg leading-7 text-zinc-200">&ldquo;Start with the smallest version of the task. Clarity follows motion.&rdquo;</p><Link href="/consultant" className="mt-5 inline-block text-sm text-violet-300 hover:text-violet-200">Ask for support →</Link></Card>
      </div>

      <Card className="mt-5">
        <div className="flex items-center justify-between"><h3 className="font-medium text-white">Recent rhythm</h3><span className="text-xs text-zinc-600">This week</span></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {['Mapped your ML roadmap', 'Completed a focus block', 'Asked Yappers for clarity'].map((item, index) => <div key={item} className="border-l border-violet-400/40 pl-4"><p className="text-sm text-zinc-300">{item}</p><p className="mt-1 text-xs text-zinc-600">{index + 1} day ago</p></div>)}
        </div>
      </Card>
    </AppShell>
  );
}
