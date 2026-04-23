import { createFileRoute } from '@tanstack/react-router';
import AdminTicketManagementPage from '@/pages/admin/AdminTicketManagementPage';
export const Route = createFileRoute('/admin/tickets')({
  head: () => ({ meta: [{ title: 'Ticket Management — Admin' }, { name: 'description', content: 'Customer service ticket queue.' }]}),
  component: () => <AdminTicketManagementPage />,
});
