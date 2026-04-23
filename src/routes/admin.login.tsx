import { createFileRoute } from '@tanstack/react-router';
import InternalAdminLoginPage from '@/pages/admin/InternalAdminLoginPage';
export const Route = createFileRoute('/admin/login')({
  head: () => ({ meta: [{ title: 'Admin Login — Gigvora' }, { name: 'description', content: 'Internal admin sign in.' }]}),
  component: () => <InternalAdminLoginPage />,
});
