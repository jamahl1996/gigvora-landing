import { createFileRoute } from '@tanstack/react-router';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
export const Route = createFileRoute('/admin/reports')({
  head: () => ({ meta: [{ title: 'Admin Reports — Gigvora' }, { name: 'description', content: 'User and content reports queue.' }]}),
  component: () => <AdminReportsPage />,
});
