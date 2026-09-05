import { AppShell } from '@/components/layout/AppShell';
import { ConsultantShell } from '@/components/consultant/ConsultantShell';

export default function ConsultantPage() {
  return (
    <AppShell title="Mentor" subtitle="A short, caring voice conversation for your next step.">
      <ConsultantShell />
    </AppShell>
  );
}
