import { AppShell } from '@/components/layout/AppShell';
import { StudySession } from '@/components/study-mode/StudySession';

export default function StudyPage() {
  return (
    <AppShell title="Study Mode" subtitle="Pick a subject, set the goal, and run a focused session with camera consent.">
      <StudySession />
    </AppShell>
  );
}
