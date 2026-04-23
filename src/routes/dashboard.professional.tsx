import { createFileRoute } from '@tanstack/react-router';
import ProfessionalDashboardPage from '@/pages/dashboard/ProfessionalDashboardPage';

export const Route = createFileRoute('/dashboard/professional')({
  head: () => ({ meta: [
    { title: 'Professional Dashboard — Gigvora' },
    { name: 'description', content: 'Pipeline, earnings, and delivery dashboard for professionals.' },
  ]}),
  component: () => <ProfessionalDashboardPage />,
});
