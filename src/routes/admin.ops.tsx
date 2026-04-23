import { createFileRoute } from '@tanstack/react-router';
import AdminOpsPage from '@/pages/admin/AdminOpsPage';
export const Route = createFileRoute('/admin/ops')({
  head: () => ({ meta: [{ title: 'Admin Ops — Gigvora' }, { name: 'description', content: 'Operations and monitoring console.' }]}),
  component: () => <AdminOpsPage />,
});
