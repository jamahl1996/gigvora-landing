import { createFileRoute } from '@tanstack/react-router';
import DashboardBillingPage from '@/pages/dashboard/DashboardBillingPage';

export const Route = createFileRoute('/dashboard/billing')({
  head: () => ({ meta: [
    { title: 'Billing — Dashboard — Gigvora' },
    { name: 'description', content: 'Plans, invoices, and payment methods for your Gigvora workspace.' },
  ]}),
  component: () => <DashboardBillingPage />,
});