import { createFileRoute } from '@tanstack/react-router';
import ServiceOrdersCenterPage from '@/pages/services/ServiceOrdersCenterPage';
export const Route = createFileRoute('/services/orders')({
  head: () => ({ meta: [{ title: 'Service Orders — Gigvora' }, { name: 'description', content: 'All active service engagements and inquiries in one center.' }]}),
  component: () => <ServiceOrdersCenterPage />,
});
