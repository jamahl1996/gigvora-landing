import { createFileRoute } from '@tanstack/react-router';
import InternalAdminShellPage from '@/pages/admin/InternalAdminShellPage';
export const Route = createFileRoute('/admin/shell')({
  head: () => ({ meta: [{ title: 'Admin Shell — Gigvora' }, { name: 'description', content: 'Internal admin shell entry.' }]}),
  component: () => <InternalAdminShellPage />,
});
