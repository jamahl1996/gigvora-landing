import { createFileRoute } from '@tanstack/react-router';
import ServiceListingBuilderPage from '@/pages/services/ServiceListingBuilderPage';
export const Route = createFileRoute('/services/create')({
  head: () => ({ meta: [{ title: 'Create a Service — Gigvora' }, { name: 'description', content: 'Publish a bespoke professional service in 10 enterprise-grade steps.' }]}),
  component: () => <ServiceListingBuilderPage />,
});
