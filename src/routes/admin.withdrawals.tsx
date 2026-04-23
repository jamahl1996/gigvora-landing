import { createFileRoute } from '@tanstack/react-router';
import AdminWithdrawalsPage from '@/pages/admin/AdminWithdrawalsPage';
export const Route = createFileRoute('/admin/withdrawals')({
  head: () => ({ meta: [{ title: 'Withdrawals — Admin' }, { name: 'description', content: 'Approve and process withdrawal requests.' }]}),
  component: () => <AdminWithdrawalsPage />,
});
