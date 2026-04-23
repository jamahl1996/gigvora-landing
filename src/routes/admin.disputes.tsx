import { createFileRoute } from '@tanstack/react-router';
import AdminDisputeManagementPage from '@/pages/admin/AdminDisputeManagementPage';
export const Route = createFileRoute('/admin/disputes')({
  head: () => ({ meta: [{ title: 'Dispute Management — Admin' }, { name: 'description', content: 'Manage open disputes and case workflow.' }]}),
  component: () => <AdminDisputeManagementPage />,
});
