import { createFileRoute } from '@tanstack/react-router';
import CsTicketDetailPage from '@/pages/admin/customer-service/CsTicketDetailPage';
export const Route = createFileRoute('/admin/tickets/$ticketId')({
  head: () => ({ meta: [{ title: 'Ticket Detail — Admin' }, { name: 'description', content: 'Customer service ticket detail.' }]}),
  component: () => <CsTicketDetailPage />,
});
