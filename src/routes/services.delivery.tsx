import { createFileRoute } from '@tanstack/react-router';
import ServiceDeliveryPage from '@/pages/services/ServiceDeliveryPage';
export const Route = createFileRoute('/services/delivery')({
  head: () => ({ meta: [{ title: 'Service Delivery — Gigvora' }, { name: 'description', content: 'Manage delivery, milestones, and approvals for active services.' }]}),
  component: () => <ServiceDeliveryPage />,
});
