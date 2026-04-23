import { createFileRoute } from '@tanstack/react-router';
import TrustSafetyDashboardPage from '@/pages/admin/TrustSafetyDashboardPage';
export const Route = createFileRoute('/admin/trust-safety')({
  head: () => ({ meta: [{ title: 'Trust and Safety — Admin' }, { name: 'description', content: 'Trust and safety operations dashboard.' }]}),
  component: () => <TrustSafetyDashboardPage />,
});
