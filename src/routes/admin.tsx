import { createFileRoute } from '@tanstack/react-router';
import AdminPage from '@/pages/admin/AdminPage';
export const Route = createFileRoute('/admin')({
  head: () => ({ meta: [{ title: 'Admin — Gigvora' }, { name: 'description', content: 'Internal admin tools.' }]}),
  component: () => <AdminPage />,
});
