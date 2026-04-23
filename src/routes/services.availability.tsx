import { createFileRoute } from '@tanstack/react-router';
import ServiceAvailabilityPage from '@/pages/services/ServiceAvailabilityPage';
export const Route = createFileRoute('/services/availability')({
  head: () => ({ meta: [{ title: 'Service Availability — Gigvora' }, { name: 'description', content: 'Set capacity and booking windows for your services.' }]}),
  component: () => <ServiceAvailabilityPage />,
});
