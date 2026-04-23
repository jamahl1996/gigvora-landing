import { createFileRoute } from '@tanstack/react-router';
import AdminPortalLandingPage from '@/pages/admin/AdminPortalLandingPage';
export const Route = createFileRoute('/admin/portal')({
  head: () => ({ meta: [{ title: 'Admin Portal — Gigvora' }, { name: 'description', content: 'Admin portal landing page.' }]}),
  component: () => <AdminPortalLandingPage />,
});
