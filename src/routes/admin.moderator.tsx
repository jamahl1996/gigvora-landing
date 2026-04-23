import { createFileRoute } from '@tanstack/react-router';
import ModeratorDashboardPage from '@/pages/admin/ModeratorDashboardPage';
export const Route = createFileRoute('/admin/moderator')({
  head: () => ({ meta: [{ title: 'Moderator Dashboard — Admin' }, { name: 'description', content: 'Moderator dashboard and tooling.' }]}),
  component: () => <ModeratorDashboardPage />,
});
