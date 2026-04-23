import { createFileRoute } from '@tanstack/react-router';
import AdminSubscriptionsPage from '@/pages/admin/AdminSubscriptionsPage';
export const Route = createFileRoute('/admin/subscriptions')({
  head: () => ({ meta: [{ title: 'Subscriptions — Admin' }, { name: 'description', content: 'Manage subscription plans and billing.' }]}),
  component: () => <AdminSubscriptionsPage />,
});
