import { createFileRoute } from '@tanstack/react-router';
import FinanceHubPage from '@/pages/finance/FinanceHubPage';
export const Route = createFileRoute('/finance')({
  head: () => ({ meta: [{ title: 'Finance — Gigvora' }, { name: 'description', content: 'Manage payouts, invoices, and earnings.' }]}),
  component: () => <FinanceHubPage />,
});
