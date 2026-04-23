import { createFileRoute } from '@tanstack/react-router';
import FinanceAdminPage from '@/pages/admin/FinanceAdminPage';
export const Route = createFileRoute('/admin/finance')({
  head: () => ({ meta: [{ title: 'Finance Admin — Gigvora' }, { name: 'description', content: 'Internal financial controls and ledgers.' }]}),
  component: () => <FinanceAdminPage />,
});
