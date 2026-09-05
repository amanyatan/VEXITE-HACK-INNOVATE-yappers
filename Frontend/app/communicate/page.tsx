import { AppShell } from '@/components/layout/AppShell';
import { CommunicationShell } from '@/components/communication/CommunicationShell';

export default function CommunicatePage() {
  return (
    <AppShell title="Communicate" subtitle="Plan what to learn, find current resources, and build simple MVPs.">
      <CommunicationShell />
    </AppShell>
  );
}
