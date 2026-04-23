import { createFileRoute } from '@tanstack/react-router';
import InvoicesPage from '@/pages/finance/InvoicesPage';
export const Route = createFileRoute('/finance/invoices')({
  head: () => ({ meta: [{ title: 'Invoices — Finance' }, { name: 'description', content: 'View and manage invoices.' }]}),
  component: () => <InvoicesPage />,
});
