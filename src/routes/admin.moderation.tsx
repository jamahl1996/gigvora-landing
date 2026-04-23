import { createFileRoute } from '@tanstack/react-router';
import AdminModerationPage from '@/pages/admin/AdminModerationPage';
export const Route = createFileRoute('/admin/moderation')({
  head: () => ({ meta: [{ title: 'Moderation — Admin' }, { name: 'description', content: 'Content moderation queue and decisions.' }]}),
  component: () => <AdminModerationPage />,
});
