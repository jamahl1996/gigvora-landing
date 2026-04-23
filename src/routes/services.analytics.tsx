import { createFileRoute } from '@tanstack/react-router';
import ServiceAnalyticsPage from '@/pages/services/ServiceAnalyticsPage';
export const Route = createFileRoute('/services/analytics')({
  head: () => ({ meta: [{ title: 'Service Analytics — Gigvora' }, { name: 'description', content: 'Inquiries, conversion, and revenue analytics for your services.' }]}),
  component: () => <ServiceAnalyticsPage />,
});
