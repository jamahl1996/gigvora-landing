import { createFileRoute } from '@tanstack/react-router';
import EnterpriseActivitySignalsPage from '@/pages/enterprise/EnterpriseActivitySignalsPage';
export const Route = createFileRoute('/enterprise/signals')({
  head: () => ({ meta: [{ title: 'Activity Signals — Enterprise — Gigvora' }, { name: 'description', content: 'Buyer intent and activity signals for enterprise sales teams.' }]}),
  component: () => <EnterpriseActivitySignalsPage />,
});
