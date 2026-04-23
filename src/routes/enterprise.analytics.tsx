import { createFileRoute } from '@tanstack/react-router';
import EnterpriseAnalyticsPage from '@/pages/enterprise/EnterpriseAnalyticsPage';
export const Route = createFileRoute('/enterprise/analytics')({
  head: () => ({ meta: [{ title: 'Enterprise Analytics — Gigvora' }, { name: 'description', content: 'Cross-team analytics for enterprise sales, hiring, and procurement.' }]}),
  component: () => <EnterpriseAnalyticsPage />,
});
