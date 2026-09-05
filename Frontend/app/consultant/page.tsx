import { AppShell } from '@/components/layout/AppShell';
import { ConsultantShell } from '@/components/consultant/ConsultantShell';

export default function ConsultantPage() {
  return (
    <AppShell title="Consultant" subtitle="Supportive coaching for pressure, overwhelm, and next steps.">
      <ConsultantShell />
    </AppShell>
  );
}
