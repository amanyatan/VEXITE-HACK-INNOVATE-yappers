import { AppShell } from '@/components/layout/AppShell';
import { StudySession } from '@/components/study-mode/StudySession';

export default function StudyPage() {
  return (
    <AppShell title="Study Mode" subtitle="Set a goal, start the timer, and let Yappers keep you accountable by voice.">
      <StudySession />
    </AppShell>
  );
}
