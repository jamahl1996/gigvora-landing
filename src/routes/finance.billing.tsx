import { createFileRoute } from '@tanstack/react-router';
import BillingPage from '@/pages/finance/BillingPage';
export const Route = createFileRoute('/finance/billing')({
  head: () => ({ meta: [{ title: 'Billing — Finance' }, { name: 'description', content: 'Manage billing details and history.' }]}),
  component: () => <BillingPage />,
});
