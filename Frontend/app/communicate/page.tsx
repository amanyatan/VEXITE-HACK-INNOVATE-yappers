import { AppShell } from '@/components/layout/AppShell';
import { CommunicationShell } from '@/components/communication/CommunicationShell';

export default function CommunicatePage() {
  return (
    <AppShell title="Communicate" subtitle="Think out loud, ask better questions, and learn with Yappers.">
      <CommunicationShell />
    </AppShell>
  );
}
