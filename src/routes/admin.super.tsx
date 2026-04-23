import { createFileRoute } from '@tanstack/react-router';
import SuperAdminPage from '@/pages/admin/SuperAdminPage';
export const Route = createFileRoute('/admin/super')({
  head: () => ({ meta: [{ title: 'Super Admin — Gigvora' }, { name: 'description', content: 'Super admin control tower.' }]}),
  component: () => <SuperAdminPage />,
});
