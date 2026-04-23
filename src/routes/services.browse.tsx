import { createFileRoute } from '@tanstack/react-router';
import ServicesBrowsePage from '@/pages/services/ServicesBrowsePage';
export const Route = createFileRoute('/services/browse')({
  head: () => ({ meta: [{ title: 'Browse Services — Gigvora' }, { name: 'description', content: 'Filter and compare services across categories, price, and rating.' }]}),
  component: () => <ServicesBrowsePage />,
});
