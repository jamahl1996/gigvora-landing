import { createFileRoute } from '@tanstack/react-router';
import VerificationComplianceDashboardPage from '@/pages/admin/VerificationComplianceDashboardPage';
export const Route = createFileRoute('/admin/compliance')({
  head: () => ({ meta: [{ title: 'Compliance — Admin' }, { name: 'description', content: 'Verification and compliance overview.' }]}),
  component: () => <VerificationComplianceDashboardPage />,
});
